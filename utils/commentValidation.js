// File: commentValidation.js
// Description: validates a submitted comment against a list of constraints

const pool = require("./mysqlPool").pool;

// checks that the submitted data does not violate any constraints
async function enforceConstraints(planId, userId) {

  try {
    await userConstraint(userId);
    await planConstraint(planId);
    await ownerConstraint(planId, userId);
    await historicalConstraint(planId);
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
        throw violation;
      }

    } else {
      return;
    }

  } catch (err) {
    if (internalError(err, violation)) {
      console.log("Error checking owner constraint\n", err);
      throw ("Internal error");
    } else {
      throw err;
    }
  }

}

//  checks that the plan still allows comments
async function historicalConstraint(planId) {

  const violation = "Cannot add comments:\nThis plan has been accepted or " +
    "rejected and no longer allows comments.";

  try {

    const sql = "SELECT * FROM Plan WHERE planId=?;";
    const results = await pool.query(sql, planId);

    if (results[0][0].status === 0 || results[0][0].status === 4) {
      throw violation;
    } else {
      return;
    }

  } catch (err) {
    if (internalError(err, violation)) {
      console.log("Error checking historical constraint\n", err);
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
