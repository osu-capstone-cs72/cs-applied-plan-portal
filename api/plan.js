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

const NAME_MIN = validation.NAME_MIN;
const NAME_MAX = validation.NAME_MAX;
const CREDITS_MIN = validation.CREDITS_MIN;

// user submits a plan
app.post("/", (req, res) => {
  // define the user form data
  console.log("Received a new plan submission.");
  const userId = req.body.userId;
  const planName = req.body.planName;
  const courses = formatStringArray([req.body.course1, req.body.course2,
    req.body.course3, req.body.course4, req.body.course5, req.body.course6,
    req.body.course7, req.body.course8, req.body.course9, req.body.course10,
    req.body.course11, req.body.course12]);

  // Only save a plan if it does not violate any constraints
  validation.enforceConstraints(userId, planName, courses).then(err => {
    if (err === null) {
      savePlan(userId, planName, courses).then(() => {
        console.log("Plan submitted - 200\n");
        res.status(200).send("Plan submitted.");
      })
      .catch((err) => {
        console.log("An internal server error occurred", err);
        res.status(500).send("An internal server error occurred. Please try again later.");
      });
    } else {
      res.status(err.status || 500).send(err.message);
    }
  }).catch((err) => {
    console.log("An internal server error occurred - 500\n Error:", err);
    res.status(500).send("An internal server error occurred. Please try again later.");
  });
});

// user gets a plan
app.get("/:planId", (req, res) => {

  console.log("User viewing plan");
  const planId = req.params.planId;

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

// get all of the comments from a plan
app.get("/:planId/comment", (req, res) => {

  console.log("View plan comments");
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
