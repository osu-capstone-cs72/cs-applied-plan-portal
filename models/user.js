// File: user.js
// Description: data functions that handle users

const pool = require("../utils/mysqlPool").pool;

// search for a list of the plans that a user has created
async function getUserPlans(userId) {

  try {
    const sql = "SELECT * FROM Plan WHERE studentId = ?;";
    const results = await pool.query(sql, [userId]);
    return results[0];
  } catch (err) {
    console.log("Error searching for user plans");
    throw Error(err);
  }

}
exports.getUserPlans = getUserPlans;