// File: plan.js
// Description: handles routing for plans

require("path");
const express = require("express");
const app = express();

const formatStringArray = require("../utils/format").formatStringArray;
const enforceConstraints = require("../utils/planValidation").enforceConstraints;
const savePlan = require("../models/plan").savePlan;
const getPlan = require("../models/plan").getPlan;
const getPlans = require("../models/plan").getPlans;
const getPlanComments = require("../models/plan").getPlanComments;
const deletePlan = require("../models/plan").deletePlan;
const {
  planSchema,
  getSchemaViolations,
  sanitizeUsingSchema
} = require("../utils/schemaValidation");

// submit a plan
app.post("/", async (req, res) => {
  try {

    // use schema validation to ensure valid request body
    const errorMessage = getSchemaViolations(req.body, planSchema);

    if (!errorMessage) {

      const sanitizedBody = sanitizeUsingSchema(req.body, planSchema);

      // get request body
      console.log("Submit a plan");
      const userId = sanitizedBody.userId;
      const planName = sanitizedBody.planName;
      const courses = formatStringArray(req.body.courses);

      // only save a plan if it does not violate any constraints
      const violation = await enforceConstraints(userId, planName, courses);
      if (violation === "valid") {

        // save the plan
        const results = await savePlan(userId, planName, courses);
        console.log("201: Submited plan has been saved\n");
        res.status(201).send(results);

      } else {

        // send an error that explains the violated constraint
        console.error("400:", violation, "\n");
        res.status(400).send({error: violation});

      }

    } else {
      console.error("400:", errorMessage, "\n");
      res.status(400).send({error: errorMessage});
      return;
    }

  } catch (err) {
    console.error("500: An internal server error occurred\n Error:", err);
    res.status(500).send({error: "An internal server error occurred. Please try again later."});
  }

});

// view a plan
app.get("/:planId", async (req, res) => {

  try {

    const planId = req.params.planId;
    console.log("View plan", planId);

    const results = await getPlan(planId);
    if (results[0].length === 0) {
      console.error("404: No plan found\n");
      res.status(404).send({error: "No plan found."});
    } else {
      console.log("200: Plan found\n");
      res.status(200).send(results);
    }

  } catch (err) {
    console.error("500: An internal server error occurred\n Error:", err);
    res.status(500).send({error: "An internal server error occurred. Please try again later."});
  }

});

// get all plans for a user
app.get("/getAllPlans/:studentId", async (req, res) => {

  try {

    const studentId = req.params.studentId;
    console.log("View all plans", studentId);

    const results = await getPlans(studentId);
    if (results[0].length === 0) {
      console.error("404: No plans found\n");
      res.status(404).send({error: "No plans found."});
    } else {
      console.log("200: Plans found\n");
      res.status(200).send(results);
    }

  } catch (err) {
    console.error("500: An internal server error occurred\n Error:", err);
    res.status(500).send({error: "An internal server error occurred. Please try again later."});
  }

});

// delete a plan
app.delete("/:planId", async (req, res) => {

  try {

    const planId = req.params.planId;
    console.log("Delete plan", planId);

    const results = await deletePlan(planId);
    if (results === 0) {
      console.error("404: No plan found\n");
      res.status(404).send({error: "Could not delete plan."});
    } else {
      console.log("202: Plan deleted\n");
      res.status(202).send({affectedRows: results});
    }

  } catch (err) {
    console.error("500: An internal server error occurred\n Error:", err);
    res.status(500).send({error: "An internal server error occurred. Please try again later."});
  }

});

// get a plans comments
app.get("/:planId/comment", async (req, res) => {

  try {

    console.log("Get a plans comments");
    const planId = req.params.planId;

    const results = await getPlanComments(planId);
    if (results.length === 0) {
      console.error("404: No comments found\n");
      res.status(404).send({error: "No comments found."});
    } else {
      console.log("200: Comments found\n");
      res.status(200).send(results);
    }

  } catch (err) {
    console.log("500: An internal server error occurred\n Error:", err);
    res.status(500).send({error: "An internal server error occurred. Please try again later."});
  }

});

module.exports = app;
