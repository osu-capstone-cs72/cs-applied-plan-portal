// File: user.js
// Description: Provides data functions that handle the User entity.

const assert = require("assert");
const {pool} = require("../services/db/mysqlPool");

// Creates a new User in the database with the provided User object.
//
// On success, returns the result header from MySQL.
// On failure, logs the error and bubbles it up.
async function createUser(newUser) {
  try {
    const sql = "INSERT INTO User SET ?";
    const results = await pool.query(sql, newUser);

    // ensure there's exactly 1 row inserted
    assert(results[0].affectedRows === 1);

    return results[0];
  } catch (err) {
    console.error("Error creating new User");
    throw Error(err);  // bubble the error up
  }
}
exports.createUser = createUser;

// Updates an existing User in the database with the provided ID and updated
// User object.
//
// On success, returns the result header from MySQL.
// On failure, logs the error and bubbles it up.
async function updateUserPartial(userId, updatedUser) {
  try {
    const sql = "UPDATE User SET ? WHERE userId = ?";
    const results = await pool.query(sql, [updatedUser, userId]);

    // ensure there's exactly 1 row affected and at most 1 row changed
    assert(results[0].affectedRows === 1 && results[0].changedRows <= 1);

    return results[0];
  } catch (err) {
    console.error("Error partially updating User");
    throw Error(err);  // bubble the error up
  }
}
exports.updateUserPartial = updateUserPartial;

// Fetches information about a User (or Users) that matches the search query.
//
// On success, returns null if there's no matching User or an array of User
// objects if there is.
// On failure, logs the error and bubbles it up.
async function searchUsers(text, role, cursor) {
  try {

    const RESULTS_PER_PAGE = 25;
    const sqlArray = [];
    let users;
    const nextCursor = {
      primary: "null",
      secondary: "null"
    };

    // initial sql query
    let sql =
      "SELECT * FROM User ";

    // only use the cursor if it isn't the initial search request
    if (cursor.primary === "null") {
      sql += "WHERE TRUE ";
    } else {

      // We set our primary cursor to the full user name as it is the value
      // that we are sorting by.
      //
      // Instances where the primary cursor value could have duplicate values
      // are handled by also sorting by user ID.

      sql += "WHERE (CONCAT(firstName , ' ' , lastName) >= ? AND " +
        "(CONCAT(firstName , ' ' , lastName) > ? OR userId >= ? )) ";
      sqlArray.push(cursor.primary);
      sqlArray.push(cursor.primary);
      sqlArray.push(cursor.secondary);

    }

    // get the text we are searching for
    if (text !== "*") {
      sql += "AND (CONCAT(firstName , ' ' , lastName) LIKE CONCAT('%', ?, '%') " +
      "OR email LIKE CONCAT('%', ?, '%') " +
      "OR userId LIKE CONCAT('%', ?, '%')) ";
      sqlArray.push(text);
      sqlArray.push(text);
      sqlArray.push(text);
    }

    // check if we are searching for a specific role (instead of any role)
    if (role !== 3) {
      sql += "AND role = ? ";
      sqlArray.push(role);
    }

    // sort search results by user name
    sql += "ORDER BY CONCAT(firstName , ' ' , lastName) ASC, " +
      "userId ASC LIMIT ?;";

    // get the number of results per page (plus the next cursor)
    sqlArray.push(RESULTS_PER_PAGE + 1);

    // perform the query
    const results = await pool.query(sql, sqlArray);

    // get the next cursor and return the correct number of users
    if (results[0].length < RESULTS_PER_PAGE + 1) {

      // if we have returned the last of the data then we return
      // a null next cursor
      users = results[0];
      nextCursor.primary = "null";
      nextCursor.secondary = "null";

    } else {

      // Our next cursor will store a primary and secondary value.
      // The primary value is the main value we are sorting by.
      // The secondary value is the user ID and it is used to sort when we
      // have results with matching primary values.
      users = results[0].slice(0, -1);
      const nextPlan = results[0][RESULTS_PER_PAGE];

      // set the primary and secondary strings
      nextCursor.primary = String(nextPlan.firstName + " " + nextPlan.lastName);
      nextCursor.secondary = String(nextPlan.userId);

    }

    return {
      users: users,
      nextCursor: nextCursor
    };

  } catch (err) {
    console.error("Error searching Users");
    throw Error(err);
  }
}
exports.searchUsers = searchUsers;

// Fetches information about a User from the database using the provided ID.
//
// On success, returns the User object if any, or `null` if no such User.
// On failure, logs the error and bubbles it up.
async function getUserById(userId) {
  try {
    const sql = "SELECT * FROM User WHERE userId = ?";
    const results = await pool.query(sql, [userId]);

    // ensure there's exactly 1 User carrying with this ID or no User at all
    assert(results[0].length === 1 || results[0].length === 0);

    return results[0].length === 1 ? results[0][0] : null;
  } catch (err) {
    console.error("Error fetching User");
    throw Error(err);  // bubble the error up
  }
}
exports.getUserById = getUserById;

// Fetches a list of Plans associated with a User from the database using the
// provided ID.
//
// On success, returns an array of Plans associated with the User; array is
// empty if there aren't any such Plans.
// On failure, logs the error and bubbles it up.
async function getUserPlans(userId) {
  try {
    const sql =
      "SELECT P.planId, P.status, planName, lastUpdated, " +
      "GROUP_CONCAT(DISTINCT CAST(CONCAT(firstName, ' ', lastName) as CHAR)) AS advisors " +
      "FROM Plan AS P " +
      "LEFT JOIN " +
      "( SELECT * FROM PlanReview AS R WHERE userId != ? ) R " +
      "ON P.planId = R.planId " +
      "LEFT JOIN User AS U " +
      "ON R.userId = U.userId " +
      "WHERE studentId = ? " +
      "GROUP BY P.planId " +
      "ORDER BY lastUpdated DESC;";

    const results = await pool.query(sql, [userId, userId]);

    return {
      plans: results[0]
    };

  } catch (err) {
    console.error("Error fetching User's Plans");
    throw Error(err);  // bubble the error up
  }
}
exports.getUserPlans = getUserPlans;
