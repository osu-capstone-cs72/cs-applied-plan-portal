console.log("Server JavaScript start");
var dotenv = require('dotenv').config();
var bodyParser = require('body-parser');
var express = require('express');
var mysql = require('mysql');
var async = require('async');
var path = require('path');
var fs = require('fs');
var app = express();
var port = process.env.PORT || 3306;

// create database connection using environment variables
var con = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB_NAME
});

// connect to the database
con.connect(function(err) {

    if(err) {
        throw err;
    } else {
        console.log("Connected to database");
    }

});

/////////////////////////////////
////*Database Plan Functions*////
/////////////////////////////////

// inserts a plan into the database
// returns a promise
function savePlan(userId, planName, courses) {

    return new Promise((resolve, reject) => {

        // insert the student id and plan name into the Plan table
        var sql = 'INSERT INTO Plan (studentId, planName, status) VALUES (?, ?, 2);'
        con.query(sql, [userId, planName], function (err, result, fields) {

            if(err) {

                console.log("Error saving plan", planId, ":\n", err);
                reject(err);

            } else {

                // get the plan ID
                var planId = result.insertId;
                console.log("Inserted plan", planId);

                // insert the selected courses into the SelectedCourse table
                sql = 'INSERT INTO SelectedCourse (planId, courseId) VALUES (?, (SELECT courseId FROM Course WHERE courseCode=?));'

                // insert each course one at a time
                async.forEach(courses, function(courseData, callback) {

                    // ignore blank course codes
                    if(courseData != "") {
                        con.query(sql, [planId, courseData], function (err, result, fields) {
                            if(err) {
                                callback(err);
                            } else {
                                console.log("Inserted course", courseData, "into plan", planId);
                                callback();
                            }
                        });
                    } else {
                        callback();
                    }

                }, function(err) {
                    if(err) {
                        console.log("Error saving plan", planId, ":\n", err);
                        deletePlan(planId);
                        reject(err);
                    } else {
                        console.log("Plan", planId, "saved");
                        resolve("plan saved");
                    }
                });
            }
        });
    });
}

// delete a plan from the database
// returns true if plan was successfully deleted
function deletePlan(planId) {

    // delete all selected courses for the plan
    var sql = 'DELETE FROM SelectedCourse WHERE planId=?;'
    con.query(sql, planId, function (err, result, fields) {

        if(err) {

            console.log("Error deleting plan", planId, ":\n", err);
            return false;

        } else {

            // delete the plan itself
            var sql = 'DELETE FROM Plan WHERE planId=?;'
            con.query(sql, planId, function (err, result, fields) {

                if(err) {

                    console.log("Error deleting plan", planId, ":\n", err);
                    return false;

                } else {

                    console.log("Plan", planId, "deleted");
                    return true;

                }
            });
        }
    });
}

//////////////////////////////////////
////*Express Middleware Functions*////
//////////////////////////////////////

// parse request bodies as JSON
app.use(bodyParser.json());

// user submits a plan
app.post('/appliedplanportal/form', async (req, res, next) => {

    // define the form data as variables
    console.log("New plan submitted");
    var userId = req.body.userId;
    var planName = req.body.planName;
    let courses = [req.body.course1, req.body.course2, req.body.course3,
        req.body.course4, req.body.course5, req.body.course6, req.body.course7,
        req.body.course8, req.body.course9, req.body.course10,
        req.body.course11, req.body.course12];

    // attempt to save the user's plan
    try {
        await savePlan(userId, planName, courses);
        res.status(200).send("Plan saved.");
    } catch {
        res.status(500).send("An internal server error occurred. Please try again later.");
    }

});

// statically serve files from the public directory
app.use(express.static('public'));

// everything else gets a 404 error
app.get('*', (req, res, next) => {
    res.status(404).send("Not found");
});

// listen on the current port
var server = app.listen(port, function () {
    console.log("Server is listening on port", port);
});
