console.log("Server JavaScript start");
var bodyParser = require('body-parser');
var express = require('express');
var mysql = require('mysql');
var path = require('path');
var fs = require('fs');
var app = express();
var port = process.env.PORT || 3306;

// create database connection using environment variables
var con = mysql.createConnection({
    //    host: process.env.SQL_HOST,
    //    user: process.env.SQL_USER,
    //    password: process.env.SQL_PASSWORD,
    //    database: process.env.SQL_DB_NAME
    host: "sql3.freesqldatabase.com",
    user: "sql3317654",
    password: "B5AVPkNRNz",
    database: "sql3317654"
});

// connect to the database
con.connect(function (err) {

    if (err) console.log(err);
    console.log("Connected to database");

});

//////////////////////////////////////
////*Express Middleware Functions*////
//////////////////////////////////////

// parse request bodies as JSON
app.use(bodyParser.json());

// submit the user's plan to the database
app.post('/appliedplanportal/form', function (req, res, next) {

    // define the form data as variables
    var userId = req.body.userId;
    var planName = req.body.planName;
    let courses = [req.body.course1, req.body.course2, req.body.course3,
        req.body.course4, req.body.course5, req.body.course6, req.body.course7,
        req.body.course8, req.body.course9, req.body.course10,
        req.body.course11, req.body.course12];

    // insert the student id and plan name into the Plan table
    var sql = 'INSERT INTO Plan (studentId, planName, status) VALUES (?, ?, 2);'
    con.query(sql, [userId, planName], function (err, result, fields) {
        if (err) {
            res.status(500).send("Error saving plan");
            throw err;
        } else {

            // get the plan ID
            var planId = result.insertId;
            console.log("Inserted plan", planId);

            // insert the selected coures into the SelectedCourse table
            sql = 'INSERT INTO SelectedCourse (planId, courseId) VALUES (?, (SELECT courseId FROM Course WHERE courseCode=?));'

            // insert each course one at a time
            for (i = 0; i < courses.length && courses[i] != ""; i++) {
                con.query(sql, [planId, courses[i]], function (err, result, fields) {
                    if (err) {
                        res.status(500).send("Error saving course")
                        throw err;
                    } else {
                        console.log("Inserted course into plan", planId);
                        //res.status(200).send("Plan saved");
                    }
                });
            }

        }
    });

});

// statically serve files from the public directory
app.use(express.static('public'));

// everything else gets a 404 error
app.get('*', function (req, res, next) {
    res.status(404).send("Not found");
});

// listen on the current port
var server = app.listen(port, function () {
    console.log("Server is listening on port", port);
});
