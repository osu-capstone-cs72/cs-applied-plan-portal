// File: reviewValidation.js
// Description: validates a submitted review against a list of constraints

const pool = require("../db/mysqlPool").pool;

// checks that the submitted data does not violate any constraints
async function enforceConstraints(planId, userId, status) {

  try {
    const role = await userConstraint(userId);
    const planStatus = await planConstraint(planId, status);
    await roleConstraint(role, status, planStatus);
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

// checks that the user exists and returns their role
async function userConstraint(userId) {

  const violation = "Invalid user ID:\nThis user can not submit a review on this plan.";

  try {

    const sql = "SELECT * FROM User WHERE userId=?;";
    const results = await pool.query(sql, userId);

    if (results[0].length === 0) {
      throw violation;
    } else if (results[0][0].role === 0) {
      throw violation;
    } else {
      return results[0][0].role.toString(10);
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

// checks that the plan exists and is using a different status
// returns the current status
async function planConstraint(planId, status) {

  const violationPlan = "Invalid plan ID:\nThe selected plan does not exist.";
  const violationStatus = "Invalid status:\nThe selected plan is already using this status.";

  try {

    const sql = "SELECT * FROM Plan WHERE planId=?;";
    const results = await pool.query(sql, planId);

    if (results[0].length === 0) {
      throw violationPlan;
    } else if (results[0][0].status === parseInt(status)) {
      throw violationStatus;
    } else {
      return results[0][0].status.toString(10);
    }

  } catch (err) {
    if (internalError(err, violationPlan) && internalError(err, violationStatus)) {
      console.log("Error checking plan constraint\n", err);
      throw ("Internal error");
    } else {
      throw err;
    }
  }

}

// checks that the selected status change is valid for the current role
async function roleConstraint(role, status, planStatus) {

  const violationSet = "Invalid role:\nThis user role is not allowed to set this status.";
  const violationChange = "Invalid role:\nThis user role is not allowed to change this status.";

  try {

    console.log("User with role", role, "is attempting to change plan status from",
      planStatus, "to", status);

    if (role === "2") {
      if (status !== "0" && status !== "1" && status !== "2" && status !== "3" && status !== "4") {
        throw violationSet;
      }
    } else if (role === "1") {
      if (status !== "0" && status !== "1" && status !== "2" && status !== "3") {
        throw violationSet;
      } else if (planStatus === "0" || planStatus === "4") {
        throw violationChange;
      }
    } else {
      throw violationSet;
    }

  } catch (err) {
    if (internalError(err, violationSet) && internalError(err, violationChange)) {
      console.log("Error checking role constraint\n", err);
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
