// File: plan.js
// Description: data functions that handle plans

const pool = require("../utils/mysqlPool").pool;

// save a plan with its selected courses. remove the plan if an error occurs
async function createPlan(userId, planName, courses) {

  try {

    // construct the first SQL query
    let sql = "BEGIN; " +
      "INSERT INTO Plan (studentId, planName, status) VALUES (?, ?, 2); " +
      "SELECT LAST_INSERT_ID();";

    // perform the first insert operation
    let results = await pool.query(sql, [userId, planName]);
    console.log("RESULTS1", results);
    const planId = results[0][1].insertId;

    // construct the second SQL query
    const sqlArray = [];
    sql = "INSERT INTO SelectedCourse (planId, courseId) VALUES ";

    // expand the sql string and array based on the number of courses
    courses.forEach((currentValue) => {
      sql += "(?, (SELECT courseId FROM Course WHERE courseCode=?)),";
      sqlArray.push(planId);
      sqlArray.push(currentValue);
    });

    // add the last line of the SQL query
    sql = sql.replace(/.$/, "; COMMIT;");

    // perform the second insert operation
    results = await pool.query(sql, sqlArray);
    console.log("RESULTS2:", results);
    return {insertId: planId};

  } catch (err) {
    console.log("Error creating plan");
    throw Error(err);
  }

}
exports.createPlan = createPlan;

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

      // get the id of the owner of the plan and the current status
      let sql = "SELECT * FROM Plan WHERE planId=?;";
      let results = await pool.query(sql, [planId]);
      const ownerId = results[0][0].studentId;
      const currentStatus = results[0][0].status;

      // If the status is not "awaiting review" we will need to update it
      if (currentStatus !== 2) {
        sql = "BEGIN;" +
        "INSERT INTO PlanReview (planId, userId, status) VALUES (?, ?, 2); " +
        "UPDATE Plan SET status=2, lastUpdated=CURRENT_TIMESTAMP() WHERE planId=?; " +
        "COMMIT;";
        results = await pool.query(sql, [planId, ownerId, planId]);
        updatedRows += 2;
      } else {
        sql = "UPDATE Plan SET status=2, lastUpdated=CURRENT_TIMESTAMP() WHERE planId=?;";
        results = await pool.query(sql, [planId]);
        updatedRows += 1;
      }

      // start by deleting all of the current selected courses
      sql = "DELETE FROM SelectedCourse WHERE planId=?;";
      results = await pool.query(sql, [planId, planName]);
      updatedRows += results[0].affectedRows;

      // insert the new selection of courses
      insertSelectedCourses(planId, courses);
      updatedRows += courses.length;

    }

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

    let sql = "SELECT * FROM Plan INNER JOIN User ON Plan.studentId = User.userId ";

    // a status code of 5 means "any" status
    if (status !== "5") {
      sql += "WHERE status=? ";
    }

    // sort by the created or last updated time
    if (created === "1") {
      sql += "ORDER BY created ";
    } else {
      sql += "ORDER BY lastUpdated ";
    }

    // sort by ascending or descending
    if (ascend === "1") {
      sql += "ASC;";
    } else {
      sql += "DESC;";
    }

    let results;
    if (status !== 5) {
      results = await pool.query(sql, [status]);
    } else {
      results = await pool.query(sql);
    }
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

    let sql = "SELECT Plan.*, User.firstName, User.lastName, User.email FROM Plan LEFT JOIN User ON User.userId=Plan.studentId WHERE planId=?;";
    const result1 = await pool.query(sql, planId);

    if (!result1[0].length) {
      return {planId: 0};
    }

    sql = "SELECT * FROM Course NATURAL JOIN SelectedCourse WHERE planId = ? " +
      "ORDER BY courseCode ASC;";

    const result2 = await pool.query(sql, planId);
    result1[0][0].courses = result2[0];
    return result1[0][0];

  } catch (err) {
    console.log("Error searching for plan");
    throw Error(err);
  }

}
exports.getPlan = getPlan;

// get all activity from a plan (comments and reviews)
async function getPlanActivity(planId) {

  try {

    const sqlComments = "SELECT 0 AS reviewId, commentId, planId, Comment.userId, text, " +
      "-1 AS status, time, firstName, lastName FROM Comment " +
      "INNER JOIN User ON User.userId=Comment.userId WHERE planId=?";

    const sqlReviews = "SELECT reviewId, 0 AS commentId, planId, PlanReview.userId, " +
      "'' AS text, status, time, firstName, lastName FROM PlanReview " +
      "INNER JOIN User ON User.userId=PlanReview.userId WHERE planId=? ORDER BY time DESC;";

    const sql = sqlComments + " UNION " + sqlReviews;

    const results = await pool.query(sql, [planId, planId, planId]);
    return {
      activities: results[0]
    };

  } catch (err) {
    console.log("Error searching for plan activity");
    throw Error(err);
  }

}
exports.getPlanActivity = getPlanActivity;

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