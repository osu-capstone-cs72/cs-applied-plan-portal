/* eslint-disable no-undef */
require("../server.js");
const {createPlanValidation} = require("../services/validation/planValidation");

// add some basic user, plan, and course data for easy reference
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

it("Create plan validation", async () => {

  const validation = await createPlanValidation(validUser, validPlanName, validCourseList);
  expect(validation).toBe("valid");

});