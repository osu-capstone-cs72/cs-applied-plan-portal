// File: plan.js
// Description: data functions that handle plans

const pool = require("../utils/mysqlPool").pool;

// save a plan with its selected courses. remove the plan if an error occurs
function savePlan(userId, planName, courses) {

  return insertPlan(userId, planName, courses)
    .then((planData) => insertSelectedCourses(planData[0], planData[1]))
    .then(() => console.log("Plan saved"))
    .catch((planData) => {
      if (planData[0]) {
        deletePlan(planData[0]);
      }
      console.log(planData[2]);
      throw Error(planData[2]);
    });

}
exports.savePlan = savePlan;

// get all data for a specific plan, including selected courses
function getPlan(planId) {

  return new Promise((resolve, reject) => {

    const sql = "SELECT * FROM Plan NATURAL JOIN SelectedCourse WHERE planId = ?;";
    pool.query(sql, [planId], (err, results) => {
      if (err) {
        console.log("Error searching for plan");
        reject(err);
      } else {
        resolve(results);
      }
    });

  })
    .then((results) => {
      return results;
    })
    .catch((err) => {
      throw Error(err);
    });

}
exports.getPlan = getPlan;

// get all comments from a plan
function getPlanComments(planId) {

  return new Promise((resolve, reject) => {

    const sql = "SELECT * FROM Comment WHERE planId = ?;";
    pool.query(sql, [planId], (err, results) => {

      if (err) {
        console.log("Error searching for comments");
        reject(err);
      } else {
        resolve(results);
      }
    });

  })
    .then((results) => {
      return results;
    })
    .catch((err) => {
      throw Error(err);
    });

}
exports.getPlanComments = getPlanComments;

// save basic plan information such as the student id and the plan name
function insertPlan(userId, planName, courses) {

  return new Promise((resolve, reject) => {

    // insert the student id and plan name into the Plan table
    const sql = "INSERT INTO Plan (studentId, planName, status) VALUES (?, ?, 2);";
    pool.query(sql, [userId, planName], (err, results) => {

      if (err) {
        console.log("Error saving plan");
        reject([0, courses, err]);
      } else {

        // get the new plan ID
        const planId = results.insertId;
        console.log("Inserted plan", planId);
        resolve([planId, courses, ""]);

      }
    });

  });

}

// save a list of selected courses for a plan
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
    pool.query(sql, sqlArray, (err) => {
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

// delete a plan from the database, including its list of selected courses
function deletePlan(planId) {

  return new Promise((resolve, reject) => {

    // delete the plan
    const sql = "DELETE FROM Plan WHERE planId=?;";
    pool.query(sql, planId, (err) => {
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
