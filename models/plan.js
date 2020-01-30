// File: plan.js
// Description: data functions that handle plans

const pool = require("../utils/mysqlPool").pool;

// save a plan with its selected courses. remove the plan if an error occurs
async function savePlan(userId, planName, courses) {

  try {

    // save the basic plan information
    const planId = await insertPlan(userId, planName);

    // while inserting the selected courses, if there is an error
    // we will need to delete the plan
    try {
      await insertSelectedCourses(planId, courses);
    } catch (err) {
      deletePlan(planId);
      throw Error(err);
    }

    console.log("Plan saved");
    return;

  } catch (err) {
    console.log("Error saving plan");
    throw Error(err);
  }

}
exports.savePlan = savePlan;

// get all data for a specific plan, including selected courses
async function getPlan(planId) {

  try {

    const sql = "SELECT * FROM Plan NATURAL JOIN SelectedCourse WHERE planId = ?;";
    const results = await pool.query(sql, planId);
    return results[0];

  } catch (err) {
    console.log("Error searching for plan");
    throw Error(err);
  }

}
exports.getPlan = getPlan;

// get all comments from a plan
async function getPlanComments(planId) {

  try {

    const sql = "SELECT * FROM Comment WHERE planId = ?;";
    const results = await pool.query(sql, planId);
    return results[0];

  } catch (err) {
    console.log("Error searching for comments");
    throw Error(err);
  }

}
exports.getPlanComments = getPlanComments;

// save basic plan information such as the student id and the plan name
async function insertPlan(userId, planName) {

  try {

    // insert the student id and plan name into the Plan table
    const sql = "INSERT INTO Plan (studentId, planName, status) VALUES (?, ?, 2);";
    const results = await pool.query(sql, [userId, planName]);
    return results[0].insertId;

  } catch (err) {
    console.log("Error inserting basic plan data");
    throw Error(err);
  }

}

// save a list of selected courses for a plan
async function insertSelectedCourses(planId, courses) {

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

  try {

    // add each of the courses to the SelectedCourse table
    await pool.query(sql, sqlArray);
    console.log("Added courses to plan", planId);
    return ([planId, courses, ""]);

  } catch (err) {
    console.log("Error adding courses to plan", planId);
    throw Error(err);
  }

}

// delete a plan from the database, including selected courses and comments
async function deletePlan(planId) {

  try {

    // delete the plan
    const sql = "DELETE FROM Plan WHERE planId=?;";
    const results = await pool.query(sql, planId);
    console.log("Plan", planId, "deleted");
    return results;

  } catch (err) {
    console.log("Error deleting plan", planId, ":\n", err);
    throw Error(err);
  }

}
exports.deletePlan = deletePlan;
