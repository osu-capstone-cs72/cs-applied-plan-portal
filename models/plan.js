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
    return {insertId: planId};

  } catch (err) {
    console.log("Error saving plan");
    throw Error(err);
  }

}
exports.savePlan = savePlan;

// update a plan with its selected courses
async function updatePlan(planId, planName, courses) {

  try {

    // keep track of the total rows affected
    let updatedRows = 0;

    // update the plan name if it has changed
    if (planName !== 0) {

      const sql = "UPDATE Plan SET planName=? WHERE planId=?;";
      const results = await pool.query(sql, [planName, planId]);
      updatedRows += results[0].affectedRows;

    }

    // update the courses list if it has changed
    if (courses !== 0) {

      // if courses change we need to get a new review from an advisor
      let sql = "UPDATE Plan SET status=2, lastUpdated=CURRENT_TIMESTAMP() WHERE planId=?;";
      let results = await pool.query(sql, [planId]);
      updatedRows += results[0].affectedRows;

      // start by deleting all of the current selected courses
      sql = "DELETE FROM SelectedCourse WHERE planId=?;";
      results = await pool.query(sql, [planId, planName]);
      updatedRows += results[0].affectedRows;

      // insert the new selection of courses
      insertSelectedCourses(planId, courses);
      updatedRows += courses.length;

    }

    console.log("Plan updated");
    return updatedRows;

  } catch (err) {
    console.log("Error updating plan plan");
    throw Error(err);
  }

}
exports.updatePlan = updatePlan;

// get all plans that match the requested status
async function getPlansStatus(status, created, ascend) {
  try {

    let sql = "SELECT * FROM Plan WHERE status=? ";

    // sort by the created or last updated time
    if (created) {
      sql += "ORDER BY created ";
    } else {
      sql += "ORDER BY lastUpdated ";
    }

    // sort by ascending or descending
    if (ascend) {
      sql += "ASC;";
    } else {
      sql += "DESC;";
    }

    const results = await pool.query(sql, [status]);
    return results[0];

  } catch (err) {
    console.log("Error searching for plans");
    throw Error(err);
  }

}
exports.getPlansStatus = getPlansStatus;

// get all data for a specific plan, including selected courses, and reviews
async function getPlan(planId) {

  try {

    let sql = "SELECT * FROM Plan WHERE planId = ?;";
    const result1 = await pool.query(sql, planId);
    sql = "SELECT * FROM Course NATURAL JOIN SelectedCourse WHERE planId = ?;";
    const result2 = await pool.query(sql, planId);
    sql = "SELECT * FROM PlanReview WHERE planId = ?;";
    const result3 = await pool.query(sql, planId);
    return [result1[0], result2[0], result3[0]];

  } catch (err) {
    console.log("Error searching for plan");
    throw Error(err);
  }

}
exports.getPlan = getPlan;

// get all plans for a specific user, including selected courses, and reviews
async function getPlans(studentId) {

  try {

    const sql = "SELECT * FROM Plan WHERE studentId = ?;";
    const result = await pool.query(sql, studentId);
    return result[0];

  } catch (err) {
    console.log("Error searching for plan");
    throw Error(err);
  }

}
exports.getPlans = getPlans;

// get all comments from a plan
async function getPlanComments(planId) {

  try {

    const sql = "SELECT * FROM Comment WHERE planId = ? ORDER BY time ASC;";
    const results = await pool.query(sql, planId);
    return results[0];

  } catch (err) {
    console.log("Error searching for comments");
    throw Error(err);
  }

}
exports.getPlanComments = getPlanComments;

// get all reviews from a plan
async function getPlanReviews(planId) {

  try {

    const sql = "SELECT * FROM PlanReview WHERE planId = ? ORDER BY timeReviewed ASC;";
    const results = await pool.query(sql, planId);
    return results[0];

  } catch (err) {
    console.log("Error searching for reviews");
    throw Error(err);
  }

}
exports.getPlanReviews = getPlanReviews;

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
    return results[0].affectedRows;

  } catch (err) {
    console.log("Error deleting plan", planId, ":\n", err);
    throw Error(err);
  }

}
exports.deletePlan = deletePlan;