// File: planValidation.js
// Description: validates plan operations against a list of constraints

const {
  nameConstraint,
  userConstraint,
  studentConstraint,
  zeroCourseConstraint,
  duplicateCourseConstraint,
  courseConstraint,
  restrictionConstraint,
  courseCreditConstraint,
  planCreditConstraint,
  limitConstraint,
  planConstraint,
  lockedConstraint,
  ownerConstraint,
  advisorConstraint,
  deleteConstraint
} = require("./planConstraints");

// checks to see if any constraints are violated when creating a plan
async function createPlanValidation(userId, planName, courses) {

  try {

    await nameConstraint(planName, userId);
    await userConstraint(userId);
    await studentConstraint(userId);
    await zeroCourseConstraint(courses);
    await duplicateCourseConstraint(courses);
    await courseConstraint(courses);
    await restrictionConstraint(courses);
    await courseCreditConstraint(courses);
    await planCreditConstraint(courses);
    await limitConstraint(userId);
    return "valid";

  } catch (err) {
    if (err.name === "ConstraintViolation") {
      return err;
    } else {
      throw err;
    }
  }

}
exports.createPlanValidation = createPlanValidation;

// checks to see if any constraints are violated when patching a plan
async function patchPlanValidation(planId, planName, courses, userId) {

  try {

    await planConstraint(planId);
    await lockedConstraint(planId);

    if (planName !== 0) {
      await nameConstraint(planName, userId, planId);
    }

    if (courses !== 0) {
      await zeroCourseConstraint(courses);
      await duplicateCourseConstraint(courses);
      await courseConstraint(courses);
      await restrictionConstraint(courses);
      await courseCreditConstraint(courses);
      await planCreditConstraint(courses);
      await ownerConstraint(planId, userId);
    }

    return "valid";

  } catch (err) {
    if (err.name === "ConstraintViolation") {
      return err;
    } else {
      throw err;
    }
  }

}
exports.patchPlanValidation = patchPlanValidation;

// checks to see if any constraints are violated when viewing a plan
async function viewPlanValidation(planId, userId) {

  try {

    await planConstraint(planId);
    await ownerConstraint(planId, userId);
    return "valid";

  } catch (err) {
    if (err.name === "ConstraintViolation") {
      return err;
    } else {
      throw err;
    }
  }

}
exports.viewPlanValidation = viewPlanValidation;

// checks to see if any constraints are violated when trying to search for a plan
async function searchPlanValidation(userId) {

  try {

    await userConstraint(userId);
    await advisorConstraint(userId);
    return "valid";

  } catch (err) {
    if (err.name === "ConstraintViolation") {
      return err;
    } else {
      throw err;
    }
  }

}
exports.searchPlanValidation = searchPlanValidation;

// checks to see if any constraints are violated when trying to delete a plan
async function deletePlanValidation(planId, userId) {

  try {

    await planConstraint(planId);
    await lockedConstraint(planId);
    await deleteConstraint(planId, userId);
    return "valid";

  } catch (err) {
    if (err.name === "ConstraintViolation") {
      return err;
    } else {
      throw err;
    }
  }

}
exports.deletePlanValidation = deletePlanValidation;

// checks that no constraints are violated when trying to view the activity feed on a plan
async function viewPlanActivityValidation(planId, userId) {

  try {

    await planConstraint(planId);
    await ownerConstraint(planId, userId);
    return "valid";

  } catch (err) {
    if (err.name === "ConstraintViolation") {
      return err;
    } else {
      throw err;
    }
  }

}
exports.viewPlanActivityValidation = viewPlanActivityValidation;