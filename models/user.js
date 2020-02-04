// File: user.js
// Description: Provides data functions that handle the User entity.

const pool = require("../utils/mysqlPool").pool;

async function getUserByOnid(onid) {
  try {
    const sql = "SELECT * FROM User WHERE userId = ?";
    const results = await pool.query(sql, [onid]);
    return results[0];
  } catch (err) {
    console.error("Error fetching User");
    throw Error(err);  // bubble up the error
  }
}
exports.getUserByOnid = getUserByOnid;

// search for a list of the plans that a user has created
async function getUserPlans(userId) {
  try {
    const sql = "SELECT * FROM Plan WHERE studentId = ?";
    const results = await pool.query(sql, [userId]);
    return results[0];
  } catch (err) {
    console.error("Error searching for user plans");
    throw Error(err);
  }
}
exports.getUserPlans = getUserPlans;
