// File: user.js
// Description: Provides data functions that handle the User entity.

const assert = require("assert");
const pool = require("../services/db/mysqlPool").pool;

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
    const sql = "SELECT * FROM Plan WHERE studentId = ?";
    const results = await pool.query(sql, [userId]);

    return results[0];
  } catch (err) {
    console.error("Error fetching User's Plans");
    throw Error(err);  // bubble the error up
  }
}
exports.getUserPlans = getUserPlans;
