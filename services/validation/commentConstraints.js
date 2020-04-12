// File: commentConstraints.js
// Description: constraints that are used when validating comment operations

const {pool} = require("../db/mysqlPool");

// checks that the user exists
async function userConstraint(userId) {

  const violation = "Invalid user ID:\nThis user can not submit a comment on this plan.";

  try {

    const sql = "SELECT * FROM User WHERE userId=?;";
    const results = await pool.query(sql, userId);

    if (results[0].length === 0) {
      throw ConstraintViolation(violation, 400);
    } else {
      return;
    }

  } catch (err) {
    console.log("Error checking user constraint\n", err);
    throw err;
  }

}
exports.userConstraint = userConstraint;

// checks that the plan exists
async function planConstraint(planId) {

  const violation = "Invalid plan ID:\nThe selected plan does not exist.";

  try {

    const sql = "SELECT * FROM Plan WHERE planId=?;";
    const results = await pool.query(sql, planId);

    if (results[0].length === 0) {
      throw ConstraintViolation(violation, 400);
    } else {
      return;
    }

  } catch (err) {
    console.log("Error checking plan constraint\n", err);
    throw err;
  }

}
exports.planConstraint = planConstraint;

//  checks that if a student is commenting that they are the owner of the plan
async function ownerConstraint(planId, userId) {

  const violation = "Invalid user ID:\nThis user is not allowed to comment on this plan.";

  try {

    let sql = "SELECT * FROM User WHERE userId=?;";
    let results = await pool.query(sql, userId);

    // if the user is a student they must be the plan owner
    if (results[0][0].role === 0) {

      sql = "SELECT * FROM Plan WHERE planId=?;";
      results = await pool.query(sql, planId);

      if (results[0][0].studentId === userId) {
        return;
      } else {
        throw ConstraintViolation(violation, 403);
      }

    } else {
      return;
    }

  } catch (err) {
    console.log("Error checking owner constraint\n", err);
    throw err;
  }

}
exports.ownerConstraint = ownerConstraint;

// checks that the plan still allows comments
async function historicalConstraint(planId) {

  const violation = "Cannot add comments:\nThis plan has been accepted or " +
    "rejected and no longer allows comments.";

  try {

    const sql = "SELECT * FROM Plan WHERE planId=?;";
    const results = await pool.query(sql, planId);

    if (results[0][0].status === 0 || results[0][0].status === 4) {
      throw ConstraintViolation(violation, 400);
    } else {
      return;
    }

  } catch (err) {
    console.log("Error checking historical constraint\n", err);
    throw err;
  }

}
exports.historicalConstraint = historicalConstraint;

// Error that is given when a constraint is violated.
// Includes a status code.
function ConstraintViolation(message, status) {
  return {
    name: "ConstraintViolation",
    message: message,
    status: status
  };
}
