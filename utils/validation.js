// File: validation.js
// Description: validates a submitted form against a list of constraints

const pool = require("./mysqlPool").pool;

// checks that the submitted form data does not violate any constraints
// returns a value that can be used to identify which constraint was violated
module.exports = function enforceConstraints(userId, planName, courses) {

  return userConstraint(userId, planName, courses)
    .then((conData) => {
      console.log("About to check if student:", conData[0], conData[1], conData[2]);
      return studentConstraint(conData[0], conData[1], conData[2]);
    })
    // .then(() => {
    //     planNameConstraint();
    // })
    // .then(() => {
    //     courseConstraint();
    // })
    // .then(() => {
    //     requiredCourseConstraint();
    // })
    // .then(() => {
    //     creditConstraint();
    // })
    // .then(() => {
    //     duplicateCourseConstraint();
    // })
    .then(() => {
      console.log("Plan does not violate any constraints");
      return 0;
    })
    .catch((conData) => {
      // see if the error was from a constraint violation
      if (conData[4]) {
        return conData[4];
      } else {
        console.log("Error while trying to check constraints");
        throw Error(conData[3]);
      }

    });

};

// checks that the user exists
function userConstraint(userId, planName, courses) {

  return new Promise((resolve, reject) => {

    const sql = "SELECT * FROM User WHERE userId=?;";
    pool.query(sql, userId, (err, result) => {

      if (err) {
        console.log("Error checking user constraint");
        reject([userId, planName, courses, err, 0]);
      } else {

        // check if the user exists
        if (!result.length)
          reject([userId, planName, courses, "", 1]);
        else
          resolve([userId, planName, courses, "", 0]);

      }
    });

  });

}

// checks that the user is a student
function studentConstraint(userId, planName, courses) {

  return new Promise((resolve, reject) => {

    console.log("About to check if student (SQL):", userId, planName, courses);
    const sql = "SELECT * FROM User WHERE userId=? AND role=0;";
    pool.query(sql, userId, (err, result) => {

      if (err) {
        console.log("Error checking user constraint");
        reject([userId, planName, courses, err, 0]);
      } else {

        // check if the user is a student
        if (!result.length)
          reject([userId, planName, courses, "", 2]);
        else
          resolve([userId, planName, courses, "", 0]);

      }
    });

  });

}

// checks that the plan name is a valid length
// function planNameConstraint() {
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
