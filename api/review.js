// File: review.js
// Description: handles routing for reviews

require("path");
const express = require("express");
const app = express();

const {createReviewValidation} = require("../services/validation/reviewValidation");
const {createReview} = require("../models/review");
const {requireAuth} = require("../services/auth/auth");
const {
  reviewSchema,
  getSchemaViolations,
  sanitizeUsingSchema
} = require("../services/validation/schemaValidation");

// create a new review
app.post("/", requireAuth, async (req, res) => {

  try {

    // use schema validation to ensure valid request body
    const errorMessage = getSchemaViolations(req.body, reviewSchema);

    if (!errorMessage) {

      const sanitizedBody = sanitizeUsingSchema(req.body, reviewSchema);

      // get request body
      const planId = sanitizedBody.planId;
      const userId = req.auth.userId;
      const status = sanitizedBody.status;
      console.log("User", userId, "creating a review on plan", planId);

      // only save a review if it does not violate any constraints
      const validation = await createReviewValidation(planId, userId, status);
      if (validation === "valid") {

        const results = await createReview(planId, userId, status);
        console.log("201: Review created\n");
        res.status(201).send(results);

      } else {

        // send an error that explains the violated constraint
        console.error(`${validation.status}:`, validation.message, "\n");
        res.status(validation.status).send({error: validation.message});

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

module.exports = app;
