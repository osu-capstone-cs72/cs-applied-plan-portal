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
  searchEnforceConstraints,
  deleteEnforceConstraints,
  activityEnforceConstraints
} = require("../services/validation/planValidation");
const {
  createPlan,
  updatePlan,
  getPlan,
  searchPlans,
  deletePlan,
  getPlanActivity,
  getRecentPlans
} = require("../models/plan");
const {
  postPlanSchema,
  patchPlanSchema,
  searchPlanSchema,
  activitySchema,
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
      const violation = await createEnforceConstraints(userId, planName, courses);
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
      const violation = await patchEnforceConstraints(planId, planName, courses, userId);
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

// view a list of recently viewed plans
app.get("/recent", requireAuth, async (req, res) => {

  try {

    const userId = req.auth.userId;
    console.log("View a list of plans recently viewed by", userId);

    const results = await getRecentPlans(userId);
    if (results.plans.length === 0) {
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

// view a plan
app.get("/:planId", requireAuth, async (req, res) => {

  try {

    const userId = req.auth.userId;
    const planId = req.params.planId;
    console.log("View plan", planId);

    // only view a plan if it does not violate any constraints
    const violation = await viewEnforceConstraints(planId, userId);
    if (violation === "valid") {

      const results = await getPlan(planId, userId);
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

// search for plans
app.get("/search/:text/:status/:sort/:order/:cursorPrimary/:cursorSecondary", requireAuth, async (req, res) => {

  try {

    // use schema validation to ensure valid request body
    const errorMessage = getSchemaViolations(req.params, searchPlanSchema);

    if (!errorMessage) {

      const sanitizedBody = sanitizeUsingSchema(req.params, searchPlanSchema);

      // get request body
      const userId = req.auth.userId;
      const text = sanitizedBody.text;
      const status = sanitizedBody.status;
      const sort = sanitizedBody.sort;
      const order = sanitizedBody.order;
      const cursorPrimary = sanitizedBody.cursorPrimary;
      const cursorSecondary = sanitizedBody.cursorSecondary;
      console.log("Searching for plans");

      // only search plans if they do not violate any constraints
      const violation = await searchEnforceConstraints(userId);
      if (violation === "valid") {

        const results = await searchPlans(text, parseInt(status, 10),
          parseInt(sort, 10), parseInt(order, 10), cursorPrimary, cursorSecondary);
        if (results.plans.length === 0) {
          console.error("404: No plans found\n");
          res.status(404).send({error: "No plans found."});
        } else {
          console.log("200: Plans found\n");
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
app.get("/:planId/activity/:page", requireAuth, async (req, res) => {

  try {

    // use schema validation to ensure valid request params
    const errorMessage = getSchemaViolations(req.params, activitySchema);

    if (!errorMessage) {

      const sanitizedBody = sanitizeUsingSchema(req.params, activitySchema);

      // get request params
      console.log("Get a plans activity");
      const userId = req.auth.userId;
      const planId = sanitizedBody.planId;
      const page = sanitizedBody.page;

      // only view plan activity if it does not violate any constraints
      const violation = await activityEnforceConstraints(planId, userId);
      if (violation === "valid") {

        const results = await getPlanActivity(planId, parseInt(page, 10));
        if (results.activity.length === 0) {
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

    } else {
      // send an error explaining the schema violation
      console.error("400:", errorMessage, "\n");
      res.status(400).send({error: errorMessage});
      return;
    }

  } catch (err) {
    console.log("500: An internal server error occurred\n Error:", err);
    res.status(500).send({error: "An internal server error occurred. Please try again later."});
  }

});

module.exports = app;
