// File: plan.js
// Description: handles routing for plans

require("path");
const express = require("express");
const app = express();

const formatStringArray = require("../utils/format");
const validation = require("../utils/validation");
const savePlan = require("../models/plan").savePlan;
const getPlan = require("../models/plan").getPlan;
const getPlanComments = require("../models/plan").getPlanComments;
const deletePlan = require("../models/plan").deletePlan;

const NAME_MIN = validation.NAME_MIN;
const NAME_MAX = validation.NAME_MAX;
const CREDITS_MIN = validation.CREDITS_MIN;

// submit a plan
app.post("/", (req, res) => {

  // define the user form data
  console.log("Submit a plan");
  const userId = req.body.userId;
  const planName = req.body.planName;
  const courses = formatStringArray([req.body.course1, req.body.course2,
    req.body.course3, req.body.course4, req.body.course5, req.body.course6,
    req.body.course7, req.body.course8, req.body.course9, req.body.course10,
    req.body.course11, req.body.course12]);

  // only save a plan if it does not violate any constraints
  validation.enforceConstraints(userId, planName, courses)
    .then((constraintViolation) => {
      switch (constraintViolation) {
        case 0:
          savePlan(userId, planName, courses)
            .then(() => {
              console.log("Plan saved - 201\n");
              res.status(201).send("Plan saved.");
            })
            .catch((err) => {
              console.log("An internal server error occurred - 500\n Error:", err);
              res.status(500).send("An internal server error occurred. Please try again later.");
            });
          break;
        case 1:
          console.log("Constraint Violated: The user does not exist - 400\n");
          res.status(400).send("Invalid ONID. Unable to submit plan.");
          break;
        case 2:
          console.log("Constraint Violated: The user is not a student - 400\n");
          res.status(400).send("Only students can submit plans.");
          break;
        case 3:
          console.log("Constraint Violated: Invalid plan name length - 400\n");
          res.status(400).send(`The plan name must be between ${NAME_MIN} ` +
            `and ${NAME_MAX} characters long.`);
          break;
        case 4:
          console.log("Constraint Violated: No courses selected - 400\n");
          res.status(400).send("No courses selected.");
          break;
        case 5:
          console.log("Constraint Violated: A course was selected more than once - 400\n");
          res.status(400).send("A course was selected more than once.");
          break;
        case 6:
          console.log("Constraint Violated: At least one course is invalid - 400\n");
          res.status(400).send("At least one selected course is invalid.");
          break;
        case 7:
          console.log("Constraint Violated: A required course was selected - 400\n");
          res.status(400).send("A required course was selected.");
          break;
        case 8:
          console.log("Constraint Violated: A graduate or professional/technical course was selected - 400\n");
          res.status(400).send("A graduate or professional/technical course was selected.");
          break;
        case 9:
          console.log(`Constraint Violated: Less than ${CREDITS_MIN} credits selected - 400\n`);
          res.status(400).send(`Less than ${CREDITS_MIN} credits selected.`);
          break;
        default:
          console.log("An internal server error occurred - 500\n");
          res.status(500).send("An internal server error occurred. Please try again later.");
          break;
      }
    })
    .catch((err) => {
      console.log("An internal server error occurred - 500\n Error:", err);
      res.status(500).send("An internal server error occurred. Please try again later.");
    });

});

// view plan
app.get("/:planId", (req, res) => {

  const planId = req.params.planId;
  console.log("View plan", planId);

  getPlan(planId)
    .then((results) => {
      if (results.length === 0) {
        console.log("No plan found - 404\n");
        res.status(404).send("No plan found.");
      } else {
        console.log("Plan found - 200\n");
        res.status(200).send(results);
      }
    })
    .catch((err) => {
      console.log("An internal server error occurred - 500\n Error:", err);
      res.status(500).send("An internal server error occurred. Please try again later.");
    });

});

// delete a plan
app.delete("/:planId", (req, res) => {

  const planId = req.params.planId;
  console.log("Delete plan", planId);

  deletePlan(planId)
    .then((results) => {
      if (results.affectedRows === 0) {
        console.log("No plan found - 404\n");
        res.status(404).send("No plan found.");
      } else {
        console.log("Plan deleted - 204\n");
        res.status(204).send("Plan deleted");
      }
    })
    .catch((err) => {
      console.log("An internal server error occurred - 500\n Error:", err);
      res.status(500).send("An internal server error occurred. Please try again later.");
    });

});

// get a plans comments
app.get("/:planId/comment", (req, res) => {

  console.log("Get a plans comments");
  const planId = req.params.planId;

  getPlanComments(planId)
    .then((results) => {
      if (results.length === 0) {
        console.log("No comments found - 404\n");
        res.status(404).send("No comments found.");
      } else {
        console.log("Comments found - 200\n");
        res.status(200).send(results);
      }
    })
    .catch((err) => {
      console.log("An internal server error occurred - 500\n Error:", err);
      res.status(500).send("An internal server error occurred. Please try again later.");
    });

});

module.exports = app;
