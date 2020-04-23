// File: commentValidation.js
// Description: validates comment operations against a list of constraints

const {
  userConstraint,
  planConstraint,
  ownerConstraint,
  historicalConstraint
} = require("./commentConstraints");


// checks to see if any constraints are violated when creating a comment
async function createCommentValidation(planId, userId) {

  try {
    await userConstraint(userId);
    await planConstraint(planId);
    await ownerConstraint(planId, userId);
    await historicalConstraint(planId);
    return "valid";

  } catch (err) {
    if (err.name === "ConstraintViolation") {
      return err;
    } else {
      throw err;
    }
  }

}
exports.createCommentValidation = createCommentValidation;