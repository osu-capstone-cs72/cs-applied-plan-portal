// File: plan.js
// Description: handles routing for plans

require("path");
const express = require("express");
const app = express();
const {requireAuth} = require("../services/auth/auth");
const {formatStringArray} = require("../services/format/format");
const {
  createEnforceConstraints,
  patchEnforceConstraints,
  viewEnforceConstraints,
  statusEnforceConstraints,
  deleteEnforceConstraints,
  activityEnforceConstraints
} = require("../services/validation/planValidation");
const {
  createPlan,
  updatePlan,
  getPlan,
  getPlansStatus,
  deletePlan,
  getPlanActivity,
} = require("../models/plan");
const {getUserById} = require("../models/user");
const {
  postPlanSchema,
  patchPlanSchema,
  statusPlanSchema,
  getSchemaViolations,
  sanitizeUsingSchema
} = require("../services/validation/schemaValidation");

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

      // only create a plan if it does not violate any constraints
      const violation = await createEnforceConstraints(userId, courses);
      if (violation === "valid") {

        // create the plan
        const results = await createPlan(userId, planName, courses);
        console.log("201: Submited plan has been created\n");
        res.status(201).send(results);

      } else {

        // send an error that explains the violated constraint
        console.error("400:", violation, "\n");
        res.status(400).send({error: violation});

      }

    } else {
      // send an error explaining the schema violation
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

      // only update a plan if it does not violate any constraints
      const violation = await patchEnforceConstraints(planId, courses, userId);
      if (violation === "valid") {

        // update the plan
        const results = await updatePlan(planId, planName, courses);
        console.log("200: Plan has been updated\n");
        res.status(200).send(results);

      } else {

        // send an error that explains the violated constraint
        console.error("400:", violation, "\n");
        res.status(400).send({error: violation});

      }

    } else {
      // send an error explaining the schema violation
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
      const userId = req.auth.userId;
      const status = sanitizedBody.status;
      const created = sanitizedBody.created;
      const ascend = sanitizedBody.ascend;
      console.log("Search plans by status");

      // only list plans if they do not violate any constraints
      const violation = await statusEnforceConstraints(userId);
      if (violation === "valid") {

        // fetch the target user matching the provided ID
        const user = await getUserById(userId);

        // if there is no matching user or if the user is not an advisor,
        // respond with an authorization error
        if (!user || (user.role !== 1 && user.role !== 2)) {
          console.error("403: Only advisors are allowed to list plans", "\n");
          res.status(403).send({error: "Only advisors are allowed to list plans"});
          return;
        }

        const results = await getPlansStatus(status, created, ascend);
        if (results.plans.length === 0) {
          console.error("404: No plans found\n");
          res.status(404).send({error: "No plans found."});
        } else {
          console.log("200: Plan found\n");
          res.status(200).send(results);
        }

      } else {

        // send an error that explains the violated constraint
        console.error("400:", violation, "\n");
        res.status(400).send({error: violation});

      }

    } else {
      // send an error explaining the schema violation
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

    const userId = req.auth.userId;
    const planId = req.params.planId;
    console.log("Delete plan", planId);

    // only delete a plan if it does not violate any constraints
    const violation = await deleteEnforceConstraints(planId, userId);
    if (violation === "valid") {

      const results = await deletePlan(planId);
      if (results.affectedRows === 0) {
        console.error("404: No plan found\n");
        res.status(404).send({error: "Could not delete plan."});
      } else {
        console.log("202: Plan deleted\n");
        res.status(202).send(results);
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

// get a plan's activity (comments and reviews)
app.get("/:planId/activity", requireAuth, async (req, res) => {

  try {

    console.log("Get a plans activity");
    const userId = req.auth.userId;
    const planId = req.params.planId;

    // only view plan activity if it does not violate any constraints
    const violation = await activityEnforceConstraints(planId, userId);
    if (violation === "valid") {

      const results = await getPlanActivity(planId);
      if (results.length === 0) {
        console.error("404: No plan activity found\n");
        res.status(404).send({error: "No plan activity found."});
      } else {
        console.log("200: Plan activity found\n");
        res.status(200).send(results);
      }

    } else {

      // send an error that explains the violated constraint
      console.error("400:", violation, "\n");
      res.status(400).send({error: violation});

    }

  } catch (err) {
    console.log("500: An internal server error occurred\n Error:", err);
    res.status(500).send({error: "An internal server error occurred. Please try again later."});
  }

});

module.exports = app;
