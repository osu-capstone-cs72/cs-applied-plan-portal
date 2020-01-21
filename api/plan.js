// File: plan.js
// Description: handles routing for plans

require("path");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const formatStringArray = require("../utils/format");
const enforceConstraints = require("../utils/validation");
const savePlan = require("../models/plan");

// parse request bodies as JSON
app.use(bodyParser.json());

// user submits a plan
app.post("/", (req, res) => {

  // define the user form data
  console.log("New plan submitted");
  const userId = req.body.userId;
  const planName = req.body.planName;
  const courses = formatStringArray([req.body.course1, req.body.course2,
    req.body.course3, req.body.course4, req.body.course5, req.body.course6,
    req.body.course7, req.body.course8, req.body.course9, req.body.course10,
    req.body.course11, req.body.course12]);

  // only save a plan if it does not violate any constraints
  enforceConstraints(userId, planName, courses)
    .then((constraintViolation) => {
      switch (constraintViolation) {
        case 0:
          savePlan(userId, planName, courses)
            .then(() => {
              console.log("Plan submitted - 200\n");
              res.status(200).send("Plan submitted.");
            })
            .catch(() => {
              console.log("An internal server error occurred - 500\n");
              res.status(500).send("An internal server error occurred. Please try again later.");
            });
          break;
        case 1:
          console.log("Constraint Violated: The user does not exist - 400\n");
          res.status(400).send("Invalid user ID. Unable to submit plan.");
          break;
        case 2:
          console.log("Constraint Violated: The user is not a student - 400\n");
          res.status(400).send("Only students can submit plans.");
          break;
        case 3:
          console.log("Constraint Violated: Invalid plan name length - 400\n");
          res.status(400).send("The plan name must be between 5 and 50 characters long.");
          break;
        case 4:
          console.log("Constraint Violated: No courses selected - 400\n");
          res.status(400).send("No courses selected.");
          break;
        case 5:
          console.log("Constraint Violated: At least one course is invalid - 400\n");
          res.status(400).send("At least one selected course is invalid.");
          break;
        case 6:
          console.log("Constraint Violated: A required course was selected - 400\n");
          res.status(400).send("A required course was selected.");
          break;
        case 7:
          console.log("Constraint Violated: Less than 32 credits selected - 400\n");
          res.status(400).send("Less than 32 credits selected.");
          break;
        case 8:
          console.log("Constraint Violated: A course was selected more than once - 400\n");
          res.status(400).send("A course was selected more than once.");
          break;
      }

    })
    .catch(() => {
      console.log("An internal server error occurred - 500\n");
      res.status(500).send("An internal server error occurred. Please try again later.");
    });

});

// everything else gets a 404 error
app.get("*", (req, res) => {
  res.status(404).send("Not found");
});

module.exports = app;
