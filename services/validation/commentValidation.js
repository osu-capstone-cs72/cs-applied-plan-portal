// File: commentValidation.js
// Description: validates a submitted comment against a list of constraints

const pool = require("../db/mysqlPool").pool;

// checks that the submitted data does not violate any constraints
async function enforceConstraints(planId, userId) {

  try {
    await userConstraint(userId);
    await planConstraint(planId);
    return "valid";

  } catch (err) {
    if (err === "Internal error") {
      throw err;
    } else {
      return err;
    }
  }

}
exports.enforceConstraints = enforceConstraints;

// checks that the user exists
async function userConstraint(userId) {

  const violation = "Invalid user ID:\nThis user can not submit a comment on this plan.";

  try {

    const sql = "SELECT * FROM User WHERE userId=?;";
    const results = await pool.query(sql, userId);

    if (results[0].length === 0) {
      throw violation;
    } else {
      return;
    }

  } catch (err) {
    if (internalError(err, violation)) {
      console.log("Error checking user constraint\n", err);
      throw ("Internal error");
    } else {
      throw err;
    }
  }

}

// checks that the plan exists
async function planConstraint(planId) {

  const violation = "Invalid plan ID:\nThe selected plan does not exist.";

  try {

    const sql = "SELECT * FROM Plan WHERE planId=?;";
    const results = await pool.query(sql, planId);

    if (results[0].length === 0) {
      throw violation;
    } else {
      return;
    }

  } catch (err) {
    if (internalError(err, violation)) {
      console.log("Error checking plan constraint\n", err);
      throw ("Internal error");
    } else {
      throw err;
    }
  }

}

// checks to see if an error is a violation or an internal error
function internalError (err, violation) {
  if (err !== violation) {
    return true;
  } else {
    return false;
  }
}
