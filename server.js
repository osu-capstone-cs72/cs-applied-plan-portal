console.log("Server JavaScript start");
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql');
const async = require('async');
const path = require('path');
const fs = require('fs');
const app = express();

// set variables using enviorment variables
const port = process.env.PORT;
const mysqlPort = process.env.SQL_PORT || 3306;
const mysqlHost = process.env.SQL_HOST;
const mysqlUser = process.env.SQL_USER;
const mysqlPassword = process.env.SQL_PASSWORD;
const mysqlDatabase = process.env.SQL_DB_NAME

// create a MySQL resource pool
const maxConnections = 10;
const mysqlPool = mysql.createPool({
    port: mysqlPort,
    host: mysqlHost,
    user: mysqlUser,
    password: mysqlPassword,
    database: mysqlDatabase,
    connectionLimit: maxConnections
});

///////////////////////////
////*General Functions*////
///////////////////////////

// takes an array of strings and makes them uppercase, free of white space,
// and removes emtpy strings
function formatStringArray(stringArray) {

    return stringArray
            .map(function(x){return x.toUpperCase().replace(/\s+/g, '')})
            .filter(function(value, index, arr){return value != ""});

}

//////////////////////////////
////*Constraint Functions*////
//////////////////////////////

// checks that the submitted form data does not violate any constraints
// returns a value that can be used to identify which constraint was violated
// async function enforceConstraints(userId, planName, courses) {
//
//     new Promise((resolve, reject) => {
//         userConstraint();
//     }).then(function()) {
//         studentConstraint();
//     }).then(function()) {
//         courseConstraint();
//     }).then(function()) {
//         requiredCourseConstraint();
//     }).then(function()) {
//         creditConstraint();
//     }).then(function()) {
//         duplicateCourseConstraint();
//     });
// }

// determines if the user exists
// returns false if the constraint is violated
function userConstraint() {
    return true;
}

// determines if the user is not a student
// returns false if the constraint is violated
function studentConstraint() {
    return true;
}

// determines if any courses are invalid
// returns false if the constraint is violated
function courseConstraint() {
    return true;
}

// determines if less than 32 credits are selected
// returns false if the constraint is violated
function creditConstraint() {
    return true;
}

// determines if the same course is selected more than once
// returns false if the constraint is violated
function duplicateCourseConstraint() {
    return true;
}

// determines if any of the courses are required courses
// returns false if the constraint is violated
function requiredCourseConstraint() {
    return true;
}

////////////////////////////
////*Database Functions*////
////////////////////////////

// save a complete plan to the database including selected courses
function savePlan(userId, planName, courses) {

    return insertPlan(userId, planName, courses)
        .then(function(planData) {
            return insertSelectedCourses(planData[0], planData[1]);
        })
        .then(function() {
            console.log("Plan saved");
        })
        .catch(function(planData) {
            if(planData[0]) deletePlan(planData[0]);
            console.log(planData[2]);
            throw Error(planData[2]);
        });

}

// insert a new row in the Plan table while returning the new plan ID
function insertPlan(userId, planName, courses) {

    return new Promise((resolve, reject) => {

        // insert the student id and plan name into the Plan table
        var sql = 'INSERT INTO Plan (studentId, planName, status) VALUES (?, ?, 2);'
        mysqlPool.query(sql, [userId, planName], function (err, result, fields) {
            if(err) {
                console.log("Error saving plan name and user ID");
                reject([0, courses, err]);
            } else {
                // get the new plan ID
                planId = result.insertId;
                console.log("Inserted plan", planId);

                resolve([planId, courses, ""]);
            }
        });
    });

}

// insert new rows in the SelectedCourse table
function insertSelectedCourses(planId, courses) {

    return new Promise((resolve, reject) => {

        var sql = 'INSERT INTO SelectedCourse (planId, courseId) VALUES ';
        var sqlArray = [];

        // expand the sql string and array based on the number of courses
        courses.forEach(function(currentValue, index) {
            sql += '(?, (SELECT courseId FROM Course WHERE courseCode=?)),';
            sqlArray.push(planId);
            sqlArray.push(currentValue);
        });
        // replace the last character of the sql query with ;
        sql = sql.replace(/.$/,';');

        // add each of the courses to the SelectedCourse table
        mysqlPool.query(sql, sqlArray, function (err, result, fields) {
            if(err) {
                console.log("Error adding courses to plan", planId);
                reject([planId, courses, err]);
            } else {
                console.log("Added courses to plan", planId);
                resolve([planId, courses, ""]);
            }
        });
    });

}

// delete a plan from the database
function deletePlan(planId) {

    return new Promise((resolve, reject) => {
        // delete the plan
        var sql = 'DELETE FROM Plan WHERE planId=?;'
        mysqlPool.query(sql, planId, function (err, result, fields) {
            if(err) {
                console.log("Error deleting plan", planId, ":\n", err);
                reject(err);
            } else {
                console.log("Plan", planId, "deleted");
                resolve();
            }
        });
    });

}

//////////////////////////////////////
////*Express Middleware Functions*////
//////////////////////////////////////

// parse request bodies as JSON
app.use(bodyParser.json());

// user submits a plan
app.post('/appliedplanportal/form', (req, res, next) => {

    // define the form data as variables
    console.log("New plan submitted");
    var userId = req.body.userId;
    var planName = req.body.planName;
    var courses = formatStringArray([req.body.course1, req.body.course2, req.body.course3,
        req.body.course4, req.body.course5, req.body.course6, req.body.course7,
        req.body.course8, req.body.course9, req.body.course10,
        req.body.course11, req.body.course12]);

    // only accept a plan if it does not violate any constraints
    //enforceConstraints(userId, planName, courses);
    switch(0) {
        case 0:
            console.log("Plan does not violate any constraints");
            savePlan(userId, planName, courses)
                .then(() => {
                    console.log("Plan submitted - 200");
                    res.status(200).send("Plan submitted.");
                })
                .catch(() => {
                    console.log("An internal server error occurred - 500");
                    res.status(500).send("An internal server error occurred. Please try again later.");
                });
            break;
        case 1:
            console.log("Constraint Violated: The user does not exist - 400");
            res.status(400).send("Invalid user ID. Unable to submit plan.");
            break;
        case 2:
            console.log("Constraint Violated: The user is not a student - 400");
            res.status(400).send("Only students can submit plans.");
            break;
        case 3:
            console.log("Constraint Violated: At least one course is invalid - 400");
            res.status(400).send("At least one selected course is invalid.");
            break;
        case 4:
            console.log("Constraint Violated: Less than 32 credits selected - 400");
            res.status(400).send("Less than 32 credits selected.");
            break;
        case 5:
            console.log("Constraint Violated: A course was selected more than once - 400");
            res.status(400).send("A course was selected more than once.");
            break;
        case 6:
            console.log("Constraint Violated: A required course was selected - 400");
            res.status(400).send("A required course was selected.");
            break;
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