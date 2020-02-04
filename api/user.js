// File: user.js
// Description: Handles API routing for Users.

require("path");
const express = require("express");
const validator = require("validator");

const {
  getUserByOnid,
  getUserPlans
} = require("../models/user");

const app = express();

app.get("/:onid", async (req, res) => {
  if (validator.isInt(req.params.onid + "")) {
    try {
      const onid = parseInt(req.params.onid);
      const results = await getUserByOnid(onid);

      if (Array.isArray(results) && results.length > 0) {
        console.log("200: User found\n");
        res.status(200).send(results[0]);
      } else {
        console.error("404: No User found\n");
        res.status(404).send("No User found");
      }
    } catch (err) {
      console.error("Error fetching User:", err);
      res.status(500).send("Unable to fetch User. Please try again later.");
    }
  } else {
    console.error("400: Invalid ONID\n");
    res.status(400).send("Invalid ONID");
  }
});

// get all of the plans created by user
app.get("/:onid/plans", async (req, res) => {
  if (validator.isInt(req.params.onid + "")) {
    try {
      const onid = parseInt(req.params.onid);
      const results = await getUserPlans(onid);

      if (Array.isArray(results) && results.length > 0) {
        console.log("200: Plans found\n");
        res.status(200).send(results);
      } else {
        console.error("404: No plans found\n");
        res.status(404).send("No plans found");
      }
    } catch (err) {
      console.error("Error fetching Plans:", err);
      res.status(500).send("Unable to fetch Plans. Please try again later.");
    }
  } else {
    console.error("400: Invalid ONID\n");
    res.status(400).send("Invalid ONID");
  }
});

module.exports = app;
