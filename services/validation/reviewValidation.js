// File: reviewValidation.js
// Description: validates review operations against a list of constraints

const {
  userConstraint,
  planConstraint,
  roleConstraint
} = require("./reviewConstraints");


// checks to see if any constraints are violated when creating a review
async function createReviewValidation(planId, userId, status) {

  try {
    const role = await userConstraint(userId);
    const planStatus = await planConstraint(planId, status);
    await roleConstraint(role, status, planStatus);
    return "valid";

  } catch (err) {
    if (err.name === "ConstraintViolation") {
      return err;
    } else {
      throw err;
    }
  }

}
exports.createReviewValidation = createReviewValidation;