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
const {generateAuthToken} = require("../utils/auth");

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

// Retrieves the CAS ticket once a User successfully logs in via ONID.
app.get("/login", (req, res) => {
  // show the ticket as a JSON object for now
  // TODO: Get the server to send the serviceValidate request with this ticket
  // back to CAS to get back a valid XML object specifying the logged in user's
  // `NetID`.
  res.status(200).send({
    ticket: req.query.ticket
  });
});

// Logs a User in.
app.post("/login", async (req, res) => {
  // ensure the provided request body is valid
  if (req.body.email && validator.isLength(req.body.email + "", {min: 1})) {
    try {
      const authenticated = await userModel.authenticateUser(req.body.email);

      if (authenticated) {
        const user = await userModel.getUserByEmail(req.body.email);
        const token = generateAuthToken(user.userId, user.role);

        console.log("200: User authenticated\n");
        res.status(200).send({
          token: token
        });
      } else {
        console.error("401: Invalid credential\n");
        res.status(401).send({
          error: "Invalid credential"
        });
      }
    } catch (err) {
      console.error("500: Error authenticating User:", err);
      res.status(500).send({
        error: "Unable to authenticate User. Please try again later."
      });
    }
  } else {
    console.error("400: Invalid request body\n");
    res.status(400).send({error: "Invalid request body"});
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

module.exports = app;
