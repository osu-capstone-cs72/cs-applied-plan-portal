// File: plan.js
// Description: data functions that handle plans

const {pool} = require("../services/db/mysqlPool");

// save a plan with its selected courses. remove the plan if an error occurs
async function createPlan(userId, planName, courses) {

  try {

    // hold on to a single connection
    const conn = await pool.getConnection();

    // construct the first SQL query
    let sql = "BEGIN; " +
      "INSERT INTO Plan (studentId, planName, status) VALUES (?, ?, 2); " +
      "SELECT LAST_INSERT_ID();";

    // perform the first insert operation
    let results = await conn.query(sql, [userId, planName]);
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
    results = await conn.query(sql, sqlArray);

    // release the connection
    conn.release();

    return {insertId: planId};

  } catch (err) {
    console.log("Error creating plan");
    throw Error(err);
  }

}
exports.createPlan = createPlan;

// update a plan with its selected courses
async function updatePlan(planId, planName, courses) {

  try {

    // get the owner and status from the current plan
    let sql = "SELECT * FROM Plan WHERE planId=?;";
    let results = await pool.query(sql, [planId]);
    const ownerId = results[0][0].studentId;
    const currentStatus = results[0][0].status;

    // keep track of what is affected
    let updatedName = false;
    let updatedCourses = false;
    const sqlArray = [];
    sql = "BEGIN;";

    // update the plan name if it has changed
    if (planName !== 0) {

      sql += "UPDATE Plan SET planName=? WHERE planId=?;";
      sqlArray.push(planName);
      sqlArray.push(planId);
      updatedName = true;

    }

    // update the courses list if it has changed
    if (courses !== 0) {

      // If the status is not "awaiting review" we will need to update it
      if (currentStatus !== 2) {
        sql += "INSERT INTO PlanReview (planId, userId, status) VALUES (?, ?, 2); " +
        "UPDATE Plan SET status=2, lastUpdated=CURRENT_TIMESTAMP() WHERE planId=?;";
        sqlArray.push(planId);
        sqlArray.push(ownerId);
        sqlArray.push(planId);
      } else {
        sql += "UPDATE Plan SET status=2, lastUpdated=CURRENT_TIMESTAMP() WHERE planId=?;";
        sqlArray.push(planId);
      }

      // delete all of the current selected courses
      sql += "DELETE FROM SelectedCourse WHERE planId=?;";
      sqlArray.push(planId);

      sql += "INSERT INTO SelectedCourse (planId, courseId) VALUES ";

      // expand the sql string and array based on the number of courses
      courses.forEach((currentValue) => {
        sql += "(?, (SELECT courseId FROM Course WHERE courseCode=?)),";
        sqlArray.push(planId);
        sqlArray.push(currentValue);
      });

      // replace the final comma with a semicolon
      sql = sql.replace(/.$/, ";");
      updatedCourses = true;

    }

    // perform the query
    if (planName !== 0 || courses !== 0) {
      sql += " COMMIT;";
      results = await pool.query(sql, sqlArray);
    }

    return {
      updatedName: updatedName,
      updatedCourses: updatedCourses
    };

  } catch (err) {
    console.log("Error updating plan plan");
    throw Error(err);
  }

}
exports.updatePlan = updatePlan;

// get all plans that match the requested search
async function searchPlans(text, status, sort, order, cursorPrimary, cursorSecondary) {
  try {

    const RESULTS_PER_PAGE = 5;
    const sqlArray = [];
    let nextCursorPrimary;
    let nextCursorSecondary;
    let plans;

    let sql = "SELECT planId, status, planName, userId, firstName, lastName, created, lastUpdated " +
      "FROM Plan INNER JOIN User ON Plan.studentId = User.userId ";

    // only use the cursor if it isn't the initial search request
    if (cursorPrimary === "null") {
      sql += "WHERE TRUE ";
    } else {

      // depending on our search query the primary cursor will
      // represent a different value.
      // select the correct order and value to sort by

      let orderChar = "<";
      if (order === 1) {
        orderChar = ">";
      }

      switch (sort) {
        case 0:
          // sql += `WHERE (CONCAT(firstName , ' ' , lastName) ${orderChar}= ? AND planId >= ?) `;
          sql += `WHERE (CONCAT(firstName , ' ' , lastName, ' ', planId) ${orderChar}= ?) `;
          break;
        case 1:
          // sql += `WHERE (userId ${orderChar}= ? AND planId >= ?) `;
          sql += `WHERE (CONCAT(userId, ' ', planId) ${orderChar}= ?) `;
          break;
        case 2:
          sql += `WHERE (CONCAT(planName, ' ', planId) ${orderChar}= ?) `;
          break;
        case 3:
          sql += `WHERE (CONCAT(status, ' ', planId) ${orderChar}= ?) `;
          break;
        case 4:
          sql += `WHERE (CONCAT(created, ' ', planId) ${orderChar}= ?) `;
          break;
        case 5:
          sql += `WHERE (CONCAT(lastUpdated, ' ', planId) ${orderChar}= ?) `;
          break;
        default:
          sql += `WHERE (CONCAT(lastUpdated, ' ', planId) ${orderChar}= ?) `;
      }
      sqlArray.push(cursorPrimary + " " + cursorSecondary);
      console.log("PLAN:", cursorPrimary + " " + cursorSecondary);

    }

    // get the text we are searching for
    if (text !== "*") {
      sql += "AND (CONCAT(firstName , ' ' , lastName) LIKE CONCAT('%', ?, '%') " +
        "OR userId LIKE CONCAT('%', ?, '%') " +
        "OR planName LIKE CONCAT('%', ?, '%')) ";
      sqlArray.push(text);
      sqlArray.push(text);
      sqlArray.push(text);
    }

    // get the status we are searching for
    if (status >= 0 && status <= 4) {
      sql += "AND status=? ";
      sqlArray.push(status);
    }

    // get the results in the order we are sorting by
    switch (sort) {
      case 0:
        sql += "ORDER BY CONCAT(firstName , ' ' , lastName, ' ', planId) ";
        break;
      case 1:
        // sql += "ORDER BY userId ";
        sql += "ORDER BY CONCAT(userId, ' ', planId) ";
        break;
      case 2:
        // sql += "ORDER BY planName ";
        sql += "ORDER BY CONCAT(planName, ' ', planId) ";
        break;
      case 3:
        // sql += "ORDER BY status ";
        sql += "ORDER BY CONCAT(status, ' ', planId) ";
        break;
      case 4:
        // sql += "ORDER BY created ";
        sql += "ORDER BY CONCAT(created, ' ', planId) ";
        break;
      case 5:
        // sql += "ORDER BY lastUpdated ";
        sql += "ORDER BY CONCAT(lastUpdated, ' ', planId) ";
        break;
      default:
        sql += "ORDER BY CONCAT(lastUpdated, ' ', planId) ";
        // sql += "ORDER BY lastUpdated ";
    }

    // order by ascending or descending
    if (order === 1) {
      sql += "ASC LIMIT ?;";
    } else {
      sql += "DESC LIMIT ?;";
    }

    // get the number of results per page (plus the next cursor)
    sqlArray.push(RESULTS_PER_PAGE + 1);

    // perform the query
    const results = await pool.query(sql, sqlArray);

    // get the next cursor and return the correct number of plans
    if (results[0].length < RESULTS_PER_PAGE + 1) {

      // if we have returned the last of the data then we return
      // a null next cursor
      plans = results[0];
      nextCursorPrimary = "null";
      nextCursorSecondary = "null";

    } else {

      // our next cursor will store a primary and secondary value.
      // the primary value is the main value we are sorting by.
      // the secondary value is the plan id and it is used in sorting when we
      // have results with matching primary values
      plans = results[0].slice(0, -1);
      const nextPlan = results[0][RESULTS_PER_PAGE];

      switch (sort) {
        case 0:
          nextCursorPrimary = String(nextPlan.firstName + " " + nextPlan.lastName);
          break;
        case 1:
          nextCursorPrimary = String(nextPlan.userId);
          break;
        case 2:
          nextCursorPrimary = String(nextPlan.planName);
          break;
        case 3:
          nextCursorPrimary = String(nextPlan.status);
          break;
        case 4:
          nextCursorPrimary = String(nextPlan.created);
          break;
        case 5:
          nextCursorPrimary = String(nextPlan.lastUpdated);
          break;
        default:
          nextCursorPrimary = String(nextPlan.lastUpdated);
      }
      nextCursorSecondary = String(nextPlan.planId);

    }

    console.log(nextCursorPrimary);
    console.log(nextCursorSecondary);
    return {
      plans: plans,
      nextCursorPrimary: nextCursorPrimary,
      nextCursorSecondary: nextCursorSecondary
    };

  } catch (err) {
    console.log("Error searching for plans");
    throw Error(err);
  }

}
exports.searchPlans = searchPlans;

// get all data for a specific plan, including selected courses, and reviews
async function getPlan(planId, userId) {

  try {

    // remove all notifications for the plan
    checkPlanNotifications(planId, userId);

    // add plan to recently viewed
    addRecentPlan(planId, userId);

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
async function getPlanActivity(planId, page) {

  try {

    // list the activity for the plan
    const RESULTS_PER_PAGE = 5;
    const offset = RESULTS_PER_PAGE * (page - 1);
    const sqlComments = "SELECT CONCAT(commentId, 'c') AS id, planId, Comment.userId, text, " +
      "-1 AS status, time, firstName, lastName FROM Comment " +
      "INNER JOIN User ON User.userId=Comment.userId WHERE planId=?";

    const sqlReviews = "SELECT CONCAT(reviewId, 'r') AS id, planId, PlanReview.userId, " +
      "'' AS text, status, time, firstName, lastName FROM PlanReview " +
      "INNER JOIN User ON User.userId=PlanReview.userId WHERE planId=? ORDER BY time DESC, id DESC LIMIT ?, ?;";

    let sql = sqlComments + " UNION " + sqlReviews;

    const results = await pool.query(sql, [planId, planId, offset, RESULTS_PER_PAGE]);

    // find the total number of pages
    sql = "SELECT ( SELECT COUNT(*) FROM Comment WHERE planId=? ) " +
      "+ ( SELECT COUNT(*) FROM PlanReview WHERE planId=? ) AS count;";
    const totalResults = await pool.query(sql, [planId, planId]);
    const totalPages = Math.ceil(totalResults[0][0].count / RESULTS_PER_PAGE);

    return {
      activity: results[0],
      page: page,
      totalPages: totalPages
    };

  } catch (err) {
    console.log("Error searching for plan activity");
    throw Error(err);
  }

}
exports.getPlanActivity = getPlanActivity;

// check all notifications on a plan for a specific user
async function checkPlanNotifications(planId, userId) {

  try {

    const sql = "UPDATE Notification SET checked=1 WHERE planId=? AND userId=?;";
    const results = await pool.query(sql, [planId, userId]);
    return {
      affectedRows: results[0].affectedRows
    };

  } catch (err) {
    console.log("Error checking notification");
    throw Error(err);
  }

}
exports.checkPlanNotifications = checkPlanNotifications;

// get a list of plans recently viewed by the user
async function getRecentPlans(userId) {

  try {

    const sql = "SELECT R.planId, planName, firstName, lastName, status, created, lastUpdated, studentId AS userId " +
      "FROM RecentPlan AS R LEFT JOIN Plan AS P " +
      "ON R.planId = P.planId LEFT JOIN User AS U " +
      "ON P.studentId = U.userId WHERE R.userId=? ORDER BY R.time DESC;";
    const results = await pool.query(sql, userId);

    return {
      plans: results[0]
    };

  } catch (err) {
    console.log("Error getting recent plans");
    throw Error(err);
  }

}
exports.getRecentPlans = getRecentPlans;

// add a plan to the recently viewed plan list
async function addRecentPlan(planId, userId) {

  try {

    // the maximum number of recent plans that a user can have
    const RECENT_MAX = 5;

    // only add recent plans for advisors
    let sql = "SELECT role FROM User WHERE userId=?";
    let results = await pool.query(sql, userId);

    if (!results[0][0].role) {
      return;
    }

    // confirm that this plan isn't already in the recent list
    sql = "SELECT * FROM RecentPlan WHERE planId=? AND userID=?";
    results = await pool.query(sql, [planId, userId]);

    if (results[0].length) {
      return;
    }

    // create the new recent plan
    sql = "INSERT INTO RecentPlan (planId, userId) VALUES (?, ?);";
    results = await pool.query(sql, [planId, userId]);

    // check if we have exceeded the max number of recent plans
    sql = "SELECT COUNT(userId) AS count FROM RecentPlan WHERE userID=?";
    results = await pool.query(sql, userId);
    const count = results[0][0].count;

    // if we have too many recent plans we will have to clear some
    if (count > RECENT_MAX) {
      const limit = count - RECENT_MAX;
      sql = "DELETE FROM RecentPlan WHERE userId=? ORDER BY time ASC LIMIT ?;";
      results = await pool.query(sql, [userId, limit]);
    }

  } catch (err) {
    console.log("Error adding to recent plans list");
    throw Error(err);
  }

}
exports.addRecentPlan = addRecentPlan;

// delete a plan from the database, including selected courses and comments
async function deletePlan(planId) {

  try {

    // delete the plan
    const sql = "DELETE FROM Plan WHERE planId=?;";
    const results = await pool.query(sql, planId);
    console.log("Plan", planId, "deleted");
    return {
      affectedRows: results[0].affectedRows
    };

  } catch (err) {
    console.log("Error deleting plan", planId, ":\n", err);
    throw Error(err);
  }

}
exports.deletePlan = deletePlan;
