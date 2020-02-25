// File: plan.js
// Description: handles routing for plans

require("path");
const express = require("express");
const app = express();

const {requireAuth} = require("../utils/auth");
const formatStringArray = require("../utils/format").formatStringArray;
const {
  createEnforceConstraints,
  patchEnforceConstraints,
  viewEnforceConstraints,
} = require("../utils/planValidation");
const {
  savePlan,
  updatePlan,
  getPlan,
  getPlansStatus,
  deletePlan,
  getPlanActivity,
} = require("../models/plan");
const {
  postPlanSchema,
  patchPlanSchema,
  statusPlanSchema,
  getSchemaViolations,
  sanitizeUsingSchema
} = require("../utils/schemaValidation");

// submit a plan
app.post("/", requireAuth, async (req, res) => {

  try {

    // use schema validation to ensure valid request body
    const errorMessage = getSchemaViolations(req.body, postPlanSchema);

    if (!errorMessage) {

      const sanitizedBody = sanitizeUsingSchema(req.body, postPlanSchema);

      // get request body
      console.log("Submit a plan");
      const userId = req.auth.userId;
      const planName = sanitizedBody.planName;
      const courses = formatStringArray(sanitizedBody.courses);

      // only save a plan if it does not violate any constraints
      const violation = await createEnforceConstraints(userId, courses);
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

// update a plan
app.patch("/", requireAuth, async (req, res) => {

  try {

    // use schema validation to ensure valid request body
    const errorMessage = getSchemaViolations(req.body, patchPlanSchema);

    if (!errorMessage) {

      const sanitizedBody = sanitizeUsingSchema(req.body, patchPlanSchema);

      // get request body
      console.log("Update a plan");
      const userId = req.auth.userId;
      const planId = sanitizedBody.planId;
      let planName = 0;
      let courses = 0;

      if (req.body.planName !== undefined) {
        planName = sanitizedBody.planName;
      }
      if (req.body.courses !== undefined) {
        if (Array.isArray(req.body.courses)) {
          courses = formatStringArray(sanitizedBody.courses);
        }
      }

      // only save a plan if it does not violate any constraints
      const violation = await patchEnforceConstraints(planId, courses, userId);
      if (violation === "valid") {

        // save the plan
        const results = await updatePlan(planId, planName, courses);
        console.log("200: Plan has been updated\n");
        res.status(200).send({affectedRows: results});

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
app.get("/:planId", requireAuth, async (req, res) => {

  try {

    const userId = req.auth.userId;
    const planId = req.params.planId;
    console.log("View plan", planId);

    // only view a plan if it does not violate any constraints
    const violation = await viewEnforceConstraints(planId, userId);
    if (violation === "valid") {

      const results = await getPlan(planId);
      if (results.planId === 0) {
        console.error("404: No plan found\n");
        res.status(404).send({error: "No plan found."});
      } else {
        console.log("200: Plan found\n");
        res.status(200).send(results);
      }

    } else {

      // send an error that explains the violated constraint
      console.error("400:", violation, "\n");
      res.status(400).send({error: violation});

    }

  } catch (err) {
    console.error("500: An internal server error occurred\n Error:", err);
    res.status(500).send({error: "An internal server error occurred. Please try again later."});
  }

});

// get plans based on status and time
app.get("/status/:status/:created/:ascend", requireAuth, async (req, res) => {

  try {

    // use schema validation to ensure valid request body
    const errorMessage = getSchemaViolations(req.params, statusPlanSchema);

    if (!errorMessage) {

      const sanitizedBody = sanitizeUsingSchema(req.params, statusPlanSchema);

      // get request body
      const status = sanitizedBody.status;
      const created = sanitizedBody.created;
      const ascend = sanitizedBody.ascend;
      console.log("Search plans by status");

      // only allow advisors to search search plans
      if (req.auth.userRole !== 1 && req.auth.userRole !== 2) {
        console.error("403: Only advisors are allowed to list plans", "\n");
        res.status(403).send({error: "Only advisors are allowed to list plans"});
        return;
      }

      const results = await getPlansStatus(status, created, ascend);
      if (results.length === 0) {
        console.error("404: No plans found\n");
        res.status(404).send({error: "No plans found."});
      } else {
        console.log("200: Plan found\n");
        res.status(200).send({plans: results});
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

// delete a plan
app.delete("/:planId", requireAuth, async (req, res) => {

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

// get a plan's activity (comments and reviews)
app.get("/:planId/activity", requireAuth, async (req, res) => {

  try {

    console.log("Get a plans activity");
    const planId = req.params.planId;

    const results = await getPlanActivity(planId);
    if (results.length === 0) {
      console.error("404: No plan activity found\n");
      res.status(404).send({error: "No plan activity found."});
    } else {
      console.log("200: Plan activity found\n");
      res.status(200).send(results);
    }

  } catch (err) {
    console.log("500: An internal server error occurred\n Error:", err);
    res.status(500).send({error: "An internal server error occurred. Please try again later."});
  }

});

module.exports = app;
