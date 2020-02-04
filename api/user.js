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

app.post("/", async (req, res) => {
  const schemaViolations = getSchemaViolations(req.body, userSchema);
  if (!schemaViolations) {
    try {
      const sanitizedNewUser = sanitizeUsingSchema(req.body, userSchema);
      const result = await userModel.createUser(sanitizedNewUser);

      console.log("201: User created\n");
      res.status(201).send({userId: result.insertId});
    } catch (err) {
      console.error("500: Error creating new User:", err);
      res.status(500).send("Error creating new User. Please try again later.");
    }
  } else {
    console.error(schemaViolations);
    res.status(400).send({error: schemaViolations});
  }
});

app.get("/:userId", async (req, res) => {
  if (validator.isInt(req.params.userId + "")) {
    try {
      const userId = parseInt(req.params.userId);
      const results = await userModel.getUserById(userId);

      if (Array.isArray(results) && results.length > 0) {
        console.log("200: User found\n");
        res.status(200).send(results[0]);
      } else {
        console.error("404: No User found\n");
        res.status(404).send("No User found");
      }
    } catch (err) {
      console.error("500: Error fetching User:", err);
      res.status(500).send("Unable to fetch User. Please try again later.");
    }
  } else {
    console.error("400: Invalid User Id\n");
    res.status(400).send("Invalid User Id");
  }
});

// get all of the plans created by user
app.get("/:userId/plans", async (req, res) => {
  if (validator.isInt(req.params.userId + "")) {
    try {
      const userId = parseInt(req.params.userId);
      const results = await userModel.getUserPlans(userId);

      if (Array.isArray(results) && results.length > 0) {
        console.log("200: Plans found\n");
        res.status(200).send(results);
      } else {
        console.error("404: No plans found\n");
        res.status(404).send("No plans found");
      }
    } catch (err) {
      console.error("500: Error fetching Plans:", err);
      res.status(500).send("Unable to fetch Plans. Please try again later.");
    }
  } else {
    console.error("400: Invalid User ID\n");
    res.status(400).send("Invalid User ID");
  }
});

module.exports = app;
