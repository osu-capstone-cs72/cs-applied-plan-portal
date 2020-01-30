// File: plan.js
// Description: handles routing for plans

require("path");
const express = require("express");
const app = express();

const formatStringArray = require("../utils/format").formatStringArray;
const enforceConstraints = require("../utils/validation").enforceConstraints;
const savePlan = require("../models/plan").savePlan;
const getPlan = require("../models/plan").getPlan;
const getPlanComments = require("../models/plan").getPlanComments;
const deletePlan = require("../models/plan").deletePlan;

// submit a plan
app.post("/", async (req, res) => {

  console.log("Submit a plan");
  const userId = req.body.userId;
  const planName = req.body.planName;
  const courses = formatStringArray(req.body.courses);

  try {

    // only save a plan if it does not violate any constraints
    const validate = await enforceConstraints(userId, planName, courses);
    if (validate.value === 0) {

      // save the plan
      await savePlan(userId, planName, courses);
      console.log("Submited plan has been saved - 201\n");
      res.status(201).send("Plan saved.");

    } else {

      // send an error that explains the violated constraint
      console.log(validate.message, "- 400\n");
      res.status(400).send(validate.message);

    }

  } catch (err) {
    console.log("An internal server error occurred - 500\n Error:", err);
    res.status(500).send("An internal server error occurred. Please try again later.");
  }

});

// view plan
app.get("/:planId", async (req, res) => {

  const planId = req.params.planId;
  console.log("View plan", planId);

  try {

    const results = await getPlan(planId);
    if (results.length === 0) {
      console.log("No plan found - 404\n");
      res.status(404).send("No plan found.");
    } else {
      console.log("Plan found - 200\n");
      res.status(200).send(results);
    }

  } catch (err) {
    console.log("An internal server error occurred - 500\n Error:", err);
    res.status(500).send("An internal server error occurred. Please try again later.");
  }

});

// delete a plan
app.delete("/:planId", async (req, res) => {

  const planId = req.params.planId;
  console.log("Delete plan", planId);

  try {

    const results = await deletePlan(planId);
    if (results.affectedRows === 0) {
      console.log("No plan found - 404\n");
      res.status(404).send("No plan found.");
    } else {
      console.log("Plan deleted - 204\n");
      res.status(204).send("Plan deleted");
    }

  } catch (err) {
    console.log("An internal server error occurred - 500\n Error:", err);
    res.status(500).send("An internal server error occurred. Please try again later.");
  }

});

// get a plans comments
app.get("/:planId/comment", async (req, res) => {

  console.log("Get a plans comments");
  const planId = req.params.planId;

  try {

    const results = await getPlanComments(planId);
    if (results.length === 0) {
      console.log("No comments found - 404\n");
      res.status(404).send("No comments found.");
    } else {
      console.log("Comments found - 200\n");
      res.status(200).send(results);
    }

  } catch (err) {
    console.log("An internal server error occurred - 500\n Error:", err);
    res.status(500).send("An internal server error occurred. Please try again later.");
  }

});

module.exports = app;
