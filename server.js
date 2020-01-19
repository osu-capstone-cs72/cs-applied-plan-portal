console.log("Server JavaScript start");
require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const mysql = require("mysql");
const app = express();
const mysqlPool = require("./utils/mysqlPool").pool;

// set the server port to listen on
const port = process.env.PORT;

///////////////////////////
// //*General Functions*////
///////////////////////////

// takes an array of strings and makes them uppercase, free of white space,
// and removes empty strings from the array
function formatStringArray(stringArray) {

  return stringArray
    .map((string) => { return string.toUpperCase().replace(/\s+/g, ""); })
    .filter((value) => { return value !== ""; });

}

//////////////////////////////
// //*Constraint Functions*////
//////////////////////////////

// checks that the submitted form data does not violate any constraints
// returns a value that can be used to identify which constraint was violated
function enforceConstraints(userId, courses) {

  return userConstraint(userId, courses)
    // .then(function() {
    //     studentConstraint();
    // })
    // .then(function() {
    //     courseConstraint();
    // })
    // .then(function() {
    //     requiredCourseConstraint();
    // })
    // .then(function() {
    //     creditConstraint();
    // })
    // .then(function() {
    //     duplicateCourseConstraint();
    // })
    .then(() => {
      console.log("Plan does not violate any constraints");
      return 0;
    })
    .catch((constraintData) => {
      // see if the error was from a constraint violation
      if (constraintData[3])
        return constraintData[3];
      else
        throw Error(constraintData[2]);

    });

}

// checks that the user exists
function userConstraint(userId, courses) {

  return new Promise((resolve, reject) => {

    // insert the student id and plan name into the Plan table
    const sql = "SELECT * FROM User WHERE userId=?;";
    mysqlPool.query(sql, userId, (err, result) => {

      if (err) {
        console.log("Error checking user constraint");
        reject([userId, courses, err, 0]);
      } else {

        // check if the user exists
        if (!result.length)
          reject([userId, courses, "", 1]);
        else
          resolve([0, courses, "", 0]);

      }
    });
  });

}

// checks that the user is a student
// function studentConstraint() {
//   return true;
// }

// checks that all courses are valid
// function courseConstraint() {
//   return true;
// }

// checks that at least 32 credits are selected
// function creditConstraint() {
//   return true;
// }

// checks that no single course is selected more than once
// function duplicateCourseConstraint() {
//   return true;
// }

// checks that no required courses are selected
// function requiredCourseConstraint() {
//   return true;
// }

////////////////////////////
// //*Database Functions*////
////////////////////////////

// save a complete plan to the database including selected courses
function savePlan(userId, planName, courses) {

  return insertPlan(userId, planName, courses)
    .then((planData) => {
      return insertSelectedCourses(planData[0], planData[1]);
    })
    .then(() => {
      console.log("Plan saved");
    })
    .catch((planData) => {
      if (planData[0]) deletePlan(planData[0]);
      console.log(planData[2]);
      throw Error(planData[2]);
    });

}

// insert a new row in the Plan table while returning the new plan ID
function insertPlan(userId, planName, courses) {

  return new Promise((resolve, reject) => {

    // insert the student id and plan name into the Plan table
    const sql = "INSERT INTO Plan (studentId, planName, status) VALUES (?, ?, 2);";
    mysqlPool.query(sql, [userId, planName], (err, result) => {

      if (err) {
        console.log("Error saving plan");
        reject([0, courses, err]);
      } else {

        // get the new plan ID
        const planId = result.insertId;
        console.log("Inserted plan", planId);
        resolve([planId, courses, ""]);

      }
    });
  });

}

// insert new rows in the SelectedCourse table
function insertSelectedCourses(planId, courses) {

  return new Promise((resolve, reject) => {

    let sql = "INSERT INTO SelectedCourse (planId, courseId) VALUES ";
    const sqlArray = [];

    // expand the sql string and array based on the number of courses
    courses.forEach((currentValue) => {
      sql += "(?, (SELECT courseId FROM Course WHERE courseCode=?)),";
      sqlArray.push(planId);
      sqlArray.push(currentValue);
    });
    // replace the last character of the sql query with ;
    sql = sql.replace(/.$/, ";");

    // add each of the courses to the SelectedCourse table
    mysqlPool.query(sql, sqlArray, (err) => {
      if (err) {
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
    const sql = "DELETE FROM Plan WHERE planId=?;";
    mysqlPool.query(sql, planId, (err) => {
      if (err) {
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
// //*Express Middleware Functions*////
//////////////////////////////////////

// parse request bodies as JSON
app.use(bodyParser.json());

// user submits a plan
app.post("/appliedplanportal/plan", (req, res) => {

  // define the user form data
  console.log("New plan submitted");
  const userId = req.body.userId;
  const planName = req.body.planName;
  const courses = formatStringArray([req.body.course1, req.body.course2, req.body.course3,
    req.body.course4, req.body.course5, req.body.course6, req.body.course7,
    req.body.course8, req.body.course9, req.body.course10,
    req.body.course11, req.body.course12]);

  // only save a plan if it does not violate any constraints
  enforceConstraints(userId, courses)
    .then((constraintViolation) => {
      switch (constraintViolation) {
      case 0:
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

    })
    .catch(() => {
      console.log("An internal server error occurred - 500");
      res.status(500).send("An internal server error occurred. Please try again later.");
    });

});

// statically serve files from the public directory
app.use(express.static("views/public"));

// everything else gets a 404 error
app.get("*", (req, res) => {
  res.status(404).send("Not found");
});

// listen on the current port
app.listen(port, () => {
  console.log("Server is listening on port", port);
});
