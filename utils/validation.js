// File: validation.js
// Description: validates a submitted form against a list of constraints

const PLAN_NAME_MIN = 5;
const PLAN_NAME_MAX = 50;
const pool = require("./mysqlPool").pool;

// checks that the submitted form data does not violate any constraints
// returns a value that can be used to identify which constraint was violated
module.exports = function enforceConstraints(userId, planName, courses) {

  return userConstraint(userId, planName, courses)
    .then((conData) => {
      return studentConstraint(conData[0], conData[1], conData[2]);
    })
    .then((conData) => {
      return planNameConstraint(conData[0], conData[1], conData[2]);
    })
    .then((conData) => {
      return zeroCourseConstraint(conData[0], conData[1], conData[2]);
    })
    .then((conData) => {
      return duplicateCourseConstraint(conData[0], conData[1], conData[2]);
    })
    .then((conData) => {
      return courseConstraint(conData[0], conData[1], conData[2]);
    })
    .then((conData) => {
      return restrictionConstraint(conData[0], conData[1], conData[2]);
    })
    // .then((conData) => {
    //   return creditConstraint(conData[0], conData[1], conData[2]);
    // })
    .then(() => {
      console.log("Plan does not violate any constraints");
      return 0;
    })
    .catch((conData) => {
      // check if the error was from a constraint violation
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
    pool.query(sql, userId, (err, results) => {

      if (err) {
        console.log("Error checking user constraint");
        reject([userId, planName, courses, err, 0]);
      } else {

        if (!results.length)
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

    const sql = "SELECT * FROM User WHERE userId=? AND role=0;";
    pool.query(sql, userId, (err, results) => {

      if (err) {
        console.log("Error checking student constraint");
        reject([userId, planName, courses, err, 0]);
      } else {

        if (!results.length)
          reject([userId, planName, courses, "", 2]);
        else
          resolve([userId, planName, courses, "", 0]);

      }
    });

  });

}

// checks that the plan name is a valid length
function planNameConstraint(userId, planName, courses) {

  return new Promise((resolve, reject) => {

    if (planName.length < PLAN_NAME_MIN || planName.length > PLAN_NAME_MAX)
      reject([userId, planName, courses, "", 3]);
    else
      resolve([userId, planName, courses, "", 0]);

  });

}

// checks to see if any courses are selected
function zeroCourseConstraint(userId, planName, courses) {

  return new Promise((resolve, reject) => {

    if (!courses.length)
      reject([userId, planName, courses, "", 4]);
    else
      resolve([userId, planName, courses, "", 0]);

  });

}

// checks that no single course is selected more than once
function duplicateCourseConstraint(userId, planName, courses) {

  return new Promise((resolve, reject) => {

    const seenCourses = Object.create(null);
    for (let i = 0; i < courses.length; ++i) {
      const courseCode = courses[i];
      if (courseCode in seenCourses)
        reject([userId, planName, courses, "", 5]);
      seenCourses[courseCode] = true;
    }
    resolve([userId, planName, courses, "", 0]);

  });

}

// checks that all courses are valid
function courseConstraint(userId, planName, courses) {

  return new Promise((resolve, reject) => {

    let sql = "SELECT COUNT(*) AS valid FROM Course WHERE courseCode IN (";
    const sqlArray = [];

    // expand the sql string and array based on the number of courses
    courses.forEach((currentValue) => {
      sql += "?,";
      sqlArray.push(currentValue);
    });
    // replace the last character of the sql query with );
    sql = sql.replace(/.$/, ");");

    // find the number of valid courses and check it against the course array
    pool.query(sql, sqlArray, (err, results) => {
      if (err) {
        console.log("Error checking course constraint");
        reject([userId, planName, courses, err, 0]);
      } else {

        if (results[0].valid !== courses.length)
          reject([userId, planName, courses, "", 6]);
        else
          resolve([userId, planName, courses, "", 0]);

      }
    });

  });

}

// checks if there are any restrictions on selected courses
function restrictionConstraint(userId, planName, courses) {

  return new Promise((resolve, reject) => {

    let sql = "SELECT restriction FROM Course WHERE courseCode IN (";
    const sqlArray = [];

    // expand the sql string and array based on the number of courses
    courses.forEach((currentValue) => {
      sql += "?,";
      sqlArray.push(currentValue);
    });
    // replace the last character of the sql query with the end of the query
    sql = sql.replace(/.$/, ") AND restriction > 0 ORDER BY restriction;");

    // check if there were any restrictions and if so, which ones
    pool.query(sql, sqlArray, (err, results) => {
      if (err) {
        console.log("Error checking restriction constraint");
        reject([userId, planName, courses, err, 0]);
      } else {

        if (results.length) {
          if (results[0].restriction === 1)
            reject([userId, planName, courses, "", 7]);
          else
            reject([userId, planName, courses, "", 8]);
        } else {
          resolve([userId, planName, courses, "", 0]);
        }

      }
    });

  });

}

// checks that at least 32 credits are selected
// function creditConstraint() {
//   return true;
// }
