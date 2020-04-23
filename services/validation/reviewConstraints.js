// File: reviewConstraints.js
// Description: constraints that are used when validating review operations

const {pool} = require("../db/mysqlPool");


// checks that the user exists and returns their role
async function userConstraint(userId) {

  const violation = "Invalid user ID:\nThis user can not submit a review on this plan.";

  try {

    const sql = "SELECT * FROM User WHERE userId=?;";
    const results = await pool.query(sql, userId);

    if (results[0].length === 0) {
      throw ConstraintViolation(violation, 403);
    } else if (results[0][0].role === 0) {
      throw ConstraintViolation(violation, 403);
    } else {
      return results[0][0].role.toString(10);
    }

  } catch (err) {
    console.log("Error checking user constraint\n");
    throw err;
  }

}
exports.userConstraint = userConstraint;


// checks that the plan exists and is using a different status
// returns the current status
async function planConstraint(planId, status) {

  const violationPlan = "Invalid plan ID:\nThe selected plan does not exist.";
  const violationStatus = "Invalid status:\nThe selected plan is already using this status.";

  try {

    const sql = "SELECT * FROM Plan WHERE planId=?;";
    const results = await pool.query(sql, planId);

    if (results[0].length === 0) {
      throw ConstraintViolation(violationPlan, 400);
    } else if (results[0][0].status === parseInt(status)) {
      throw ConstraintViolation(violationStatus, 400);
    } else {
      return results[0][0].status.toString(10);
    }

  } catch (err) {
    console.log("Error checking plan constraint\n");
    throw err;
  }

}
exports.planConstraint = planConstraint;


// checks that the selected status change is valid for the current role
async function roleConstraint(role, status, planStatus) {

  const violationSet = "Invalid role:\nThis user role is not allowed to set this status.";
  const violationChange = "Invalid role:\nThis user role is not allowed to change this status.";

  try {

    console.log("User with role", role, "is attempting to change plan status from",
      planStatus, "to", status);

    if (role === "2") {
      if (status !== "0" && status !== "1" && status !== "2" && status !== "3" && status !== "4") {
        throw ConstraintViolation(violationSet, 400);
      }
    } else if (role === "1") {
      if (status !== "0" && status !== "1" && status !== "2" && status !== "3") {
        throw ConstraintViolation(violationSet, 400);
      } else if (planStatus === "0" || planStatus === "4") {
        throw ConstraintViolation(violationChange, 400);
      }
    } else {
      throw ConstraintViolation(violationSet, 400);
    }

  } catch (err) {
    console.log("Error checking role constraint\n");
    throw err;
  }

}
exports.roleConstraint = roleConstraint;


// Error that is given when a constraint is violated.
// Includes a status code.
function ConstraintViolation(message, status) {
  return {
    name: "ConstraintViolation",
    message: message,
    status: status
  };
}
