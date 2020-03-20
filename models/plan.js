// File: plan.js
// Description: data functions that handle plans

const {pool} = require("../services/db/mysqlPool");

// save a plan with its selected courses. remove the plan if an error occurs
async function createPlan(userId, planName, courses) {

  try {

    // start by figuring out the credits required for each course
    const courseCredits = [];
    for (let i = 0; i < courses.length; i++) {

      // get credits for current course
      const sql  = "SELECT credits FROM Course WHERE courseId = ?;";
      const results = await pool.query(sql, courses[i].courseId);

      // check if credits is a value or a range and then add the credits
      // to the courseCredits array
      if (isNaN(results[0][0].credits)) {
        courseCredits[i] = parseInt(courses[i].credits, 10);
      } else {
        courseCredits[i] = parseInt(results[0][0].credits, 10);
      }

    }

    // hold on to a single connection
    const conn = await pool.getConnection();

    // construct the insertion SQL query
    let sql = "BEGIN; " +
      "INSERT INTO Plan (studentId, planName, status) VALUES (?, ?, 2); " +
      "SELECT LAST_INSERT_ID();";

    // perform the first insert operation
    let results = await conn.query(sql, [userId, planName]);
    const planId = results[0][1].insertId;

    // construct the second SQL query
    const sqlArray = [];
    sql = "INSERT INTO SelectedCourse (planId, courseId, credits) VALUES ";

    // expand the sql string and array based on the number of courses
    courses.forEach((currentValue, index) => {
      sql += "(?, ?, ?),";
      sqlArray.push(planId);
      sqlArray.push(currentValue.courseId);
      sqlArray.push(courseCredits[index]);
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

    // start by figuring out the credits required for each course
    const courseCredits = [];
    for (let i = 0; i < courses.length; i++) {

      // get credits for current course
      const sql  = "SELECT credits FROM Course WHERE courseId = ?;";
      const results = await pool.query(sql, courses[i].courseId);

      // check if credits is a value or a range and then add the credits
      // to the courseCredits array
      if (isNaN(results[0][0].credits)) {
        courseCredits[i] = parseInt(courses[i].credits, 10);
      } else {
        courseCredits[i] = parseInt(results[0][0].credits, 10);
      }

    }

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

      sql += "INSERT INTO SelectedCourse (planId, courseId, credits) VALUES ";

      // expand the sql string and array based on the number of courses
      courses.forEach((currentValue, index) => {
        sql += "(?, ?, ?),";
        sqlArray.push(planId);
        sqlArray.push(currentValue.courseId);
        sqlArray.push(courseCredits[index]);
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
async function searchPlans(text, status, sort, order, cursor) {
  try {

    const ASC = 1;
    const RESULTS_PER_PAGE = 10;
    const sqlArray = [];
    let plans;
    const nextCursor = {
      primary: "null",
      secondary: "null"
    };

    let sql = "SELECT planId, status, planName, userId, firstName, lastName, created, lastUpdated, " +
      "UNIX_TIMESTAMP(created) AS createdUnix, UNIX_TIMESTAMP(lastUpdated) AS updatedUnix " +
      "FROM Plan INNER JOIN User ON Plan.studentId = User.userId ";

    // only use the cursor if it isn't the initial search request
    if (cursor.primary === "null") {
      sql += "WHERE TRUE ";
    } else {

      // Depending on our search query the primary cursor value may
      // represent any number of values (ex: userId, status, etc...).
      // We select the correct value by using the value that we are sorting by.
      //
      // Instances where the primary cursor value could have duplicate values
      // are handled by also sorting by plan ID.

      let orderChar = "<";
      if (order === ASC) {
        orderChar = ">";
      }

      switch (sort) {
        case 0:
          sql += `WHERE (CONCAT(firstName , ' ' , lastName) ${orderChar}= ? AND ` +
            `(CONCAT(firstName , ' ' , lastName) ${orderChar} ? OR planId >= ? )) `;
          break;
        case 1:
          sql += `WHERE (userId ${orderChar}= ? AND ` +
            `(userId ${orderChar} ? OR planId >= ? )) `;
          break;
        case 2:
          sql += `WHERE (planName ${orderChar}= ? AND ` +
            `(planName ${orderChar} ? OR planId >= ? )) `;
          break;
        case 3:
          sql += `WHERE (status ${orderChar}= ? AND ` +
            `(status ${orderChar} ? OR planId >= ? )) `;
          break;
        case 4:
          sql += `WHERE (UNIX_TIMESTAMP(created) ${orderChar}= ? AND ` +
            `(UNIX_TIMESTAMP(created) ${orderChar} ? OR planId >= ? )) `;
          break;
        case 5:
          sql += `WHERE (UNIX_TIMESTAMP(lastUpdated) ${orderChar}= ? AND ` +
            `(UNIX_TIMESTAMP(lastUpdated) ${orderChar} ? OR planId >= ? )) `;
          break;
        default:
          sql += `WHERE (UNIX_TIMESTAMP(lastUpdated) ${orderChar}= ? AND ` +
            `(UNIX_TIMESTAMP(lastUpdated) ${orderChar} ? OR planId >= ? )) `;
      }
      sqlArray.push(cursor.primary);
      sqlArray.push(cursor.primary);
      sqlArray.push(cursor.secondary);

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
        sql += "ORDER BY CONCAT(firstName , ' ' , lastName) ";
        break;
      case 1:
        sql += "ORDER BY userId ";
        break;
      case 2:
        sql += "ORDER BY planName ";
        break;
      case 3:
        sql += "ORDER BY status ";
        break;
      case 4:
        sql += "ORDER BY createdUnix ";
        break;
      case 5:
        sql += "ORDER BY updatedUnix ";
        break;
      default:
        sql += "ORDER BY updatedUnix ";
    }

    // order by ascending or descending
    if (order === ASC) {
      sql += "ASC, planId ASC LIMIT ?;";
    } else {
      sql += "DESC, planId ASC LIMIT ?;";
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
      nextCursor.primary = "null";
      nextCursor.secondary = "null";

    } else {

      // Our next cursor will store a primary and secondary value.
      // The primary value is the main value we are sorting by.
      // The secondary value is the plan ID and it is used to sort when we
      // have results with matching primary values.
      plans = results[0].slice(0, -1);
      const nextPlan = results[0][RESULTS_PER_PAGE];

      switch (sort) {
        case 0:
          nextCursor.primary = String(nextPlan.firstName + " " + nextPlan.lastName);
          break;
        case 1:
          nextCursor.primary = String(nextPlan.userId);
          break;
        case 2:
          nextCursor.primary = String(nextPlan.planName);
          break;
        case 3:
          nextCursor.primary = String(nextPlan.status);
          break;
        case 4:
          nextCursor.primary = String(nextPlan.createdUnix);
          break;
        case 5:
          nextCursor.primary = String(nextPlan.updatedUnix);
          break;
        default:
          nextCursor.primary = String(nextPlan.updatedUnix);
      }
      nextCursor.secondary = String(nextPlan.planId);

    }

    return {
      plans: plans,
      nextCursor: nextCursor
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

    let sql = "SELECT Plan.*, User.firstName, User.lastName, User.email " +
      "FROM Plan " +
      "LEFT JOIN User ON User.userId=Plan.studentId " +
      "WHERE planId=?;";

    const result1 = await pool.query(sql, planId);

    if (!result1[0].length) {
      return {planId: 0};
    }

    sql = "SELECT C.courseId, C.courseName, C.courseCode, C.prerequisites, S.credits " +
      "FROM Course AS C " +
      "LEFT JOIN SelectedCourse AS S " +
      "ON C.courseId = S.courseId " +
      "WHERE planId = ? " +
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
async function getPlanActivity(planId, cursor) {

  try {

    // list the activity for the plan
    const RESULTS_PER_PAGE = 10;
    const sqlArray = [];
    let activity;
    const nextCursor = {
      primary: "null",
      secondary: "null"
    };

    // construct the sql query
    const sqlComments = "SELECT CONCAT(commentId, 'c') AS id, planId, Comment.userId, text, " +
      "-1 AS status, time, UNIX_TIMESTAMP(time) AS timeUnix, firstName, lastName FROM Comment " +
      "INNER JOIN User ON User.userId=Comment.userId WHERE planId=?";
    sqlArray.push(planId);

    const sqlReviews = "SELECT CONCAT(reviewId, 'r') AS id, planId, PlanReview.userId, " +
      "'' AS text, status, time, UNIX_TIMESTAMP(time) AS timeUnix, firstName, lastName FROM PlanReview " +
      "INNER JOIN User ON User.userId=PlanReview.userId WHERE planId=? ORDER BY timeUnix DESC, id ASC";
    sqlArray.push(planId);

    let sql = "SELECT * FROM (" + sqlComments + " UNION " + sqlReviews + ") AS U ";

    // only use the cursor if it isn't the initial search request
    if (cursor.primary !== "null") {
      sql += `WHERE (UNIX_TIMESTAMP(time) <= ? AND ` +
        `(UNIX_TIMESTAMP(time) < ? OR id >= ? )) `;
      sqlArray.push(cursor.primary);
      sqlArray.push(cursor.primary);
      sqlArray.push(cursor.secondary);
      sqlArray.push(RESULTS_PER_PAGE + 1);
    }

    // get the number of results per page (plus the next cursor)
    sql += "LIMIT ?;";
    sqlArray.push(RESULTS_PER_PAGE + 1);

    // perform the query
    const results = await pool.query(sql, sqlArray);

    // get the next cursor and return the correct number of activities
    if (results[0].length < RESULTS_PER_PAGE + 1) {

      // if we have returned the last of the data then we return
      // a null next cursor
      activity = results[0];
      nextCursor.primary = "null";
      nextCursor.secondary = "null";

    } else {

      // Our next cursor will store the time and the activity ID
      activity = results[0].slice(0, -1);
      const nextActivity = results[0][RESULTS_PER_PAGE];
      nextCursor.primary = String(nextActivity.timeUnix);
      nextCursor.secondary = String(nextActivity.id);

    }

    return {
      activity: activity,
      nextCursor: nextCursor
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

// get a count of the similar accepted and rejected plans
async function getSimilarPlans(planId) {

  try {

    // get all of the selected courses from the current plan
    let sql = "SELECT courseId FROM SelectedCourse WHERE planId=?;";
    let results = await pool.query(sql, planId);

    const courses = results[0];
    const sqlArray = [planId];

    // if we don't have any courses then we stop here
    if (!courses.length) {
      return ({
        accepted: 0,
        rejected: 0
      });
    }

    // add each course to the sql array for the following queries
    for (let i = 0; i < courses.length; i++) {
      sqlArray.push(courses[i].courseId);
    }

    // keep track of the total number of courses we are checking
    sqlArray.push(courses.length);

    // get all similar accepted plans
    sql = "SELECT count(*) AS count FROM " +
    "(SELECT S.planId, courseId, status, COUNT(*) AS matches " +
    "FROM SelectedCourse AS S " +
    "LEFT JOIN Plan AS P " +
    "ON S.planId = P.planId " +
    "WHERE status = 4 " +
    "AND S.planId != ? ";

    // make sure we only select courses that are in our plan
    sql += "AND (courseId = ? ";

    for (let i = 2; i < sqlArray.length - 1; i++) {
      sql += "OR courseId = ? ";
    }

    sql += ") GROUP BY S.planId) AS C WHERE matches >= ?;";

    // perform the query for the accepted courses
    results = await pool.query(sql, sqlArray);
    const accepted = results[0][0].count;

    // perform the query for the rejected courses
    sql = sql.replace("WHERE status = 4", "WHERE status = 0");
    results = await pool.query(sql, sqlArray);
    const rejected = results[0][0].count;

    return {
      accepted: accepted,
      rejected: rejected
    };

  } catch (err) {
    console.log("Error getting similar plans");
    throw Error(err);
  }

}
exports.getSimilarPlans = getSimilarPlans;

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

    // if the plan is already in the recent plans list delete it
    // this will allow us to replace at it the correct place in the list
    sql = "DELETE FROM RecentPlan WHERE planId=? AND userID=?";
    await pool.query(sql, [planId, userId]);

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
