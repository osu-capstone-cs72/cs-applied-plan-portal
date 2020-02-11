// File: user.js
// Description: Handles API routing for Users.

require("path");
const express = require("express");
const validator = require("validator");

const userModel = require("../models/user");
const {
  userSchema,
  getSchemaViolations,
  sanitizeUsingSchema
} = require("../utils/schemaValidation");

const app = express();

// Creates a new User in the system.
app.post("/", async (req, res) => {
  // validate the request body against the schema and get error message, if any
  const schemaViolations = getSchemaViolations(req.body, userSchema);
  if (!schemaViolations) {
    // if there were no schema violations, continue to proceed
    try {
      // sanitize the request body and pass it to the model
      const newUser = sanitizeUsingSchema(req.body, userSchema);
      const result = await userModel.createUser(newUser);

      console.log("201: User created\n");
      res.status(201).send({userId: result.insertId});
    } catch (err) {
      console.error("500: Error creating new User:", err);
      res.status(500).send({
        error: "Error creating new User. Please try again later."
      });
    }
  } else {
    console.error(schemaViolations);
    res.status(400).send({error: schemaViolations});
  }
});

// Fetches information about a specific User.
app.get("/:userId", async (req, res) => {
  // ensure the provided request parameter is a valid integer
  if (validator.isInt(req.params.userId + "")) {
    try {
      // sanitize the request parameter and pass it to the model
      const userId = validator.toInt(req.params.userId);
      const results = await userModel.getUserById(userId);

      if (Array.isArray(results) && results.length > 0) {
        console.log("200: User found\n");
        res.status(200).send(results[0]);
      } else {
        console.error("404: No User found\n");
        res.status(404).send({error: "No User found"});
      }
    } catch (err) {
      console.error("500: Error fetching User:", err);
      res.status(500).send({
        error: "Unable to fetch User. Please try again later."
      });
    }
  } else {
    console.error("400: Invalid User Id\n");
    res.status(400).send({error: "Invalid User Id"});
  }
});

// Fetches a list of plans related to a specific User.
app.get("/:userId/plans", async (req, res) => {
  // ensure the provided request parameter is a valid integer
  if (validator.isInt(req.params.userId + "")) {
    try {
      // sanitize the request parameter and pass it to the model
      const userId = validator.toInt(req.params.userId);
      const results = await userModel.getUserPlans(userId);

      if (Array.isArray(results) && results.length > 0) {
        console.log("200: Plans found\n");
        res.status(200).send(results);
      } else {
        console.error("404: No plans found\n");
        res.status(404).send({error: "No plans found"});
      }
    } catch (err) {
      console.error("500: Error fetching Plans:", err);
      res.status(500).send({
        error: "Unable to fetch Plans. Please try again later."
      });
    }
  } else {
    console.error("400: Invalid User ID\n");
    res.status(400).send({error: "Invalid User ID"});
  }
});

// Logs a User in.
app.post("/login", async (req, res) => {

});

module.exports = app;
