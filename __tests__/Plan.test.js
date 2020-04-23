/* eslint-disable no-undef */
require("../server.js");
const {createPlanValidation} = require("../services/validation/planValidation");
const {
  nameConstraint,
  userConstraint,
  studentConstraint,
  zeroCourseConstraint,
  duplicateCourseConstraint,
  courseConstraint,
  restrictionConstraint,
  courseCreditConstraint,
  planCreditConstraint
} = require("../services/validation/planConstraints");


it("New plan does not violate any constraints", async () => {

  const validUser = "50734529811";
  const validPlanName = "Jest Test Plan";
  const validCourseList = [
    {courseId: "2679", credits: 3},
    {courseId: "2680", credits: 4},
    {courseId: "2681", credits: 3},
    {courseId: "2682", credits: 3},
    {courseId: "2683", credits: 3},
    {courseId: "2684", credits: 3},
    {courseId: "2685", credits: 3},
    {courseId: "2686", credits: 3},
    {courseId: "2687", credits: 2},
    {courseId: "2690", credits: 3},
    {courseId: "2698", credits: 3}];

  const badUser = "abcde";
  const badPlanName = " ";
  const badCourseList = [
    {courseId: "2679", credits: 3},
    {courseId: "2680", credits: 4},
    {courseId: "2681", credits: 3}];

  let validation = await createPlanValidation(validUser, validPlanName, validCourseList);
  expect(validation).toBe("valid");
  validation = await createPlanValidation(badUser, badPlanName, badCourseList);
  expect(validation).not.toBe("valid");

});


it("User cannot create a plan with the same name as another plan they own", async () => {

  const validUser = "50734529811";
  const newPlanName = "Super New Plan";
  const oldPlanName = "Map Plan";

  expect(await nameConstraint(newPlanName, validUser)).toBe(undefined);

  let error = false;
  try {
    await nameConstraint(oldPlanName, validUser);
  } catch (err) {
    error = true;
  }
  expect(error).toBeTruthy();

});


it("Checks that the user creating the plan exists in the database", async () => {

  const validUser = "50734529811";
  const invalidUser = "111abc111";

  expect(await userConstraint(validUser)).toBe(undefined);

  let error = false;
  try {
    await userConstraint(invalidUser);
  } catch (err) {
    error = true;
  }
  expect(error).toBeTruthy();

});


it("Checks that the user creating a plan is a student", async () => {

  const studentUser = "50734529811";
  const advisorUser = "80612566209";

  expect(await studentConstraint(studentUser)).toBe(undefined);

  let error = false;
  try {
    await studentConstraint(advisorUser);
  } catch (err) {
    error = true;
  }
  expect(error).toBeTruthy();

});


it("Checks that a plan's courses is never an empty array", async () => {

  const validCourseList = [
    {courseId: "2679", credits: 3},
    {courseId: "2680", credits: 4},
    {courseId: "2681", credits: 3},
    {courseId: "2682", credits: 3},
    {courseId: "2683", credits: 3},
    {courseId: "2684", credits: 3},
    {courseId: "2685", credits: 3},
    {courseId: "2686", credits: 3},
    {courseId: "2687", credits: 2},
    {courseId: "2690", credits: 3},
    {courseId: "2698", credits: 3}];
  const emptyCourseList = [];

  expect(await zeroCourseConstraint(validCourseList)).toBe(undefined);

  let error = false;
  try {
    await zeroCourseConstraint(emptyCourseList);
  } catch (err) {
    error = true;
  }
  expect(error).toBeTruthy();

});


it("Checks that a plan never includes the same course more than once", async () => {

  const validCourseList = [
    {courseId: "2679", credits: 3},
    {courseId: "2680", credits: 4},
    {courseId: "2681", credits: 3},
    {courseId: "2682", credits: 3},
    {courseId: "2683", credits: 3},
    {courseId: "2684", credits: 3},
    {courseId: "2685", credits: 3},
    {courseId: "2686", credits: 3},
    {courseId: "2687", credits: 2},
    {courseId: "2690", credits: 3},
    {courseId: "2698", credits: 3}];
  const doubleCourseList = [
    {courseId: "2679", credits: 3},
    {courseId: "2680", credits: 4},
    {courseId: "2681", credits: 3},
    {courseId: "2682", credits: 3},
    {courseId: "2682", credits: 3},
    {courseId: "2684", credits: 3},
    {courseId: "2685", credits: 3},
    {courseId: "2686", credits: 3},
    {courseId: "2687", credits: 2},
    {courseId: "2690", credits: 3},
    {courseId: "2698", credits: 3}];
  const tripleCourseList = [
    {courseId: "2679", credits: 3},
    {courseId: "2680", credits: 4},
    {courseId: "2681", credits: 3},
    {courseId: "2682", credits: 3},
    {courseId: "2683", credits: 3},
    {courseId: "2684", credits: 3},
    {courseId: "2685", credits: 3},
    {courseId: "2687", credits: 2},
    {courseId: "2698", credits: 3},
    {courseId: "2698", credits: 3},
    {courseId: "2698", credits: 3}];

  expect(await duplicateCourseConstraint(validCourseList)).toBe(undefined);

  let error = false;
  try {
    await duplicateCourseConstraint(doubleCourseList);
  } catch (err) {
    error = true;
  }
  expect(error).toBeTruthy();

  error = false;
  try {
    await duplicateCourseConstraint(tripleCourseList);
  } catch (err) {
    error = true;
  }
  expect(error).toBeTruthy();

});


it("Checks that each course in a plan matches a course in the database", async () => {

  const validCourseList = [
    {courseId: "2679", credits: 3},
    {courseId: "2680", credits: 4},
    {courseId: "2681", credits: 3},
    {courseId: "2682", credits: 3},
    {courseId: "2683", credits: 3},
    {courseId: "2684", credits: 3},
    {courseId: "2685", credits: 3},
    {courseId: "2686", credits: 3},
    {courseId: "2687", credits: 2},
    {courseId: "2690", credits: 3},
    {courseId: "2698", credits: 3}];
  const invalidCourseList = [
    {courseId: "2679", credits: 3},
    {courseId: "2680", credits: 4},
    {courseId: "2681", credits: 3},
    {courseId: "2682", credits: 3},
    {courseId: "2683", credits: 3},
    {courseId: "2684", credits: 3},
    {courseId: "2685", credits: 3},
    {courseId: "2686", credits: 3},
    {courseId: "-1007", credits: 2},
    {courseId: "2690", credits: 3},
    {courseId: "2698", credits: 3}];

  expect(await courseConstraint(validCourseList)).toBe(undefined);

  let error = false;
  try {
    await courseConstraint(invalidCourseList);
  } catch (err) {
    error = true;
  }
  expect(error).toBeTruthy();

});


it("Checks that there are no required or graduate courses in a plan", async () => {

  const validCourseList = [
    {courseId: "2679", credits: 3},
    {courseId: "2680", credits: 4},
    {courseId: "2681", credits: 3},
    {courseId: "2682", credits: 3},
    {courseId: "2683", credits: 3},
    {courseId: "2684", credits: 3},
    {courseId: "2685", credits: 3},
    {courseId: "2686", credits: 3},
    {courseId: "2687", credits: 2},
    {courseId: "2690", credits: 3},
    {courseId: "2698", credits: 3}];
  const requiredCourseList = [
    {courseId: "27", credits: 4},
    {courseId: "2680", credits: 4},
    {courseId: "2681", credits: 3},
    {courseId: "2682", credits: 3},
    {courseId: "2683", credits: 3},
    {courseId: "2684", credits: 3},
    {courseId: "2685", credits: 3},
    {courseId: "2686", credits: 3},
    {courseId: "-1007", credits: 2},
    {courseId: "2690", credits: 3},
    {courseId: "2698", credits: 3}];
  const graduateCourseList = [
    {courseId: "79", credits: 2},
    {courseId: "2680", credits: 4},
    {courseId: "2681", credits: 3},
    {courseId: "2682", credits: 3},
    {courseId: "2683", credits: 3},
    {courseId: "2684", credits: 3},
    {courseId: "2685", credits: 3},
    {courseId: "2686", credits: 3},
    {courseId: "-1007", credits: 2},
    {courseId: "2690", credits: 3},
    {courseId: "2698", credits: 3}];

  expect(await restrictionConstraint(validCourseList)).toBe(undefined);

  let error = false;
  try {
    await restrictionConstraint(requiredCourseList);
  } catch (err) {
    error = true;
  }
  expect(error).toBeTruthy();

  error = false;
  try {
    await restrictionConstraint(graduateCourseList);
  } catch (err) {
    error = true;
  }
  expect(error).toBeTruthy();

});


it("Ensures that all courses in a plan have credits that match their valid credit ranges", async () => {

  const validNoRangeCourseList = [
    {courseId: "2679", credits: 3},
    {courseId: "2680", credits: 4},
    {courseId: "2681", credits: 3},
    {courseId: "2682", credits: 3},
    {courseId: "2683", credits: 3},
    {courseId: "2684", credits: 3},
    {courseId: "2685", credits: 3},
    {courseId: "2686", credits: 3},
    {courseId: "2687", credits: 2},
    {courseId: "2690", credits: 3},
    {courseId: "2698", credits: 3}];
  const validRangeCourseList = [
    {courseId: "2234", credits: 1},
    {courseId: "135", credits: 5},
    {courseId: "1627", credits: 10},
    {courseId: "5465", credits: 16},
    {courseId: "599", credits: 15},
    {courseId: "3174", credits: 2}];
  const invalidNoRangeCourseList = [
    {courseId: "2679", credits: 6},
    {courseId: "2680", credits: 4},
    {courseId: "2681", credits: 3},
    {courseId: "2682", credits: 3},
    {courseId: "2683", credits: 3},
    {courseId: "2684", credits: 3},
    {courseId: "2685", credits: 4},
    {courseId: "2686", credits: 3},
    {courseId: "2687", credits: 2},
    {courseId: "2690", credits: 3},
    {courseId: "2698", credits: 3}];
  const invalidRangeCourseList = [
    {courseId: "2234", credits: 1},
    {courseId: "135", credits: 5},
    {courseId: "1627", credits: 10},
    {courseId: "5465", credits: 17},
    {courseId: "599", credits: 15},
    {courseId: "3174", credits: 2}];

  expect(await courseCreditConstraint(validNoRangeCourseList)).toBe(undefined);
  expect(await courseCreditConstraint(validRangeCourseList)).toBe(undefined);

  let error = false;
  try {
    await courseCreditConstraint(invalidNoRangeCourseList);
  } catch (err) {
    error = true;
  }
  expect(error).toBeTruthy();

  error = false;
  try {
    await courseCreditConstraint(invalidRangeCourseList);
  } catch (err) {
    error = true;
  }
  expect(error).toBeTruthy();

});


it("Checks that a plan has at least 32 credits and no more than 50 credits", async () => {

  const validCourseList = [
    {courseId: "2234", credits: 1},
    {courseId: "135", credits: 5},
    {courseId: "1627", credits: 10},
    {courseId: "5465", credits: 5},
    {courseId: "599", credits: 15},
    {courseId: "3174", credits: 2}];
  const lowValidCourseList = [
    {courseId: "2234", credits: 1},
    {courseId: "135", credits: 1},
    {courseId: "1627", credits: 10},
    {courseId: "5465", credits: 10},
    {courseId: "599", credits: 10}];
  const highValidCourseList = [
    {courseId: "2234", credits: 10},
    {courseId: "135", credits: 10},
    {courseId: "1627", credits: 10},
    {courseId: "5465", credits: 10},
    {courseId: "599", credits: 5},
    {courseId: "3174", credits: 5}];
  const lowInvalidCourseList = [
    {courseId: "2234", credits: 1},
    {courseId: "135", credits: 1},
    {courseId: "1627", credits: 9},
    {courseId: "5465", credits: 10},
    {courseId: "599", credits: 10}];
  const highInvalidCourseList = [
    {courseId: "2234", credits: 10},
    {courseId: "135", credits: 11},
    {courseId: "1627", credits: 10},
    {courseId: "5465", credits: 10},
    {courseId: "599", credits: 5},
    {courseId: "3174", credits: 5}];

  expect(await planCreditConstraint(validCourseList)).toBe(undefined);
  expect(await planCreditConstraint(lowValidCourseList)).toBe(undefined);
  expect(await planCreditConstraint(highValidCourseList)).toBe(undefined);

  let error = false;
  try {
    await planCreditConstraint(lowInvalidCourseList);
  } catch (err) {
    error = true;
  }
  expect(error).toBeTruthy();

  error = false;
  try {
    await planCreditConstraint(highInvalidCourseList);
  } catch (err) {
    error = true;
  }
  expect(error).toBeTruthy();

});