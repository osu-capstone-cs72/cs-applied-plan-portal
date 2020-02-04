// File: user.js
// Description: Provides data functions that handle the User entity.

const pool = require("../utils/mysqlPool").pool;
const {userSchema, sanitizeUsingSchema} = require("../utils/schemaValidation");

async function createUser(user) {
  try {
    user = sanitizeUsingSchema(user, userSchema);
    const sql = "INSERT INTO User SET ?";
    const results = await pool.query(sql, user);
    return results[0];
  } catch (err) {
    console.error("Error creating new User");
    throw Error(err);  // bubble the error up
  }
}
exports.createUser = createUser;

async function getUserByOnid(onid) {
  try {
    const sql = "SELECT * FROM User WHERE userId = ?";
    const results = await pool.query(sql, [onid]);
    return results[0];
  } catch (err) {
    console.error("Error fetching User");
    throw Error(err);  // bubble the error up
  }
}
exports.getUserByOnid = getUserByOnid;

// search for a list of the plans that a user has created
async function getUserPlans(onid) {
  try {
    const sql = "SELECT * FROM Plan WHERE studentId = ?";
    const results = await pool.query(sql, [onid]);
    return results[0];
  } catch (err) {
    console.error("Error fetching User's Plans");
    throw Error(err);  // bubble the error up
  }
}
exports.getUserPlans = getUserPlans;
