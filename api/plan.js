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
        console.log("Submited plan has been saved - 201\n");
        res.status(201).send(results);

      } else {

        // send an error that explains the violated constraint
        console.log(violation, "- 400\n");
        res.status(400).send({error: violation});

      }

    } else {
      console.log(errorMessage, "- 400\n");
      res.status(400).send({error: errorMessage});
      return;
    }

  } catch (err) {
    console.log("An internal server error occurred - 500\n Error:", err);
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
      console.log("No plan found - 404\n");
      res.status(404).send({error: "No plan found."});
    } else {
      console.log("Plan found - 200\n");
      res.status(200).send(results);
    }

  } catch (err) {
    console.log("An internal server error occurred - 500\n Error:", err);
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
      console.log("No plan found - 404\n");
      res.status(404).send({error: "Could not delete plan."});
    } else {
      console.log("Plan deleted - 202\n");
      res.status(202).send({affectedRows: results});
    }

  } catch (err) {
    console.log("An internal server error occurred - 500\n Error:", err);
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
      console.log("No comments found - 404\n");
      res.status(404).send({error: "No comments found."});
    } else {
      console.log("Comments found - 200\n");
      res.status(200).send(results);
    }

  } catch (err) {
    console.log("An internal server error occurred - 500\n Error:", err);
    res.status(500).send({error: "An internal server error occurred. Please try again later."});
  }

});

module.exports = app;
