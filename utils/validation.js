// File: validation.js
// Description: validates a submitted form against a list of constraints

const mysqlPool = require("./mysqlPool").pool;

// checks that the submitted form data does not violate any constraints
// returns a value that can be used to identify which constraint was violated
module.exports = function enforceConstraints(userId, courses) {

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
