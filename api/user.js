// File: user.js
// Description: handles routing for users

require("path");
const express = require("express");
const app = express();

const getUserPlans = require("../models/user").getUserPlans;

// get all of the plans created by user
app.get("/:userId/plan", async (req, res) => {

  const userId = req.params.userId;
  console.log("Get all of the plans created by user", userId);

  try {

    const results = await getUserPlans(userId);
    if (results.length === 0) {
      console.log("No plans found - 404\n");
      res.status(404).send("No plans found.");
    } else {
      console.log("Plans found - 200\n");
      res.status(200).send(results);
    }

  } catch (err) {
    console.log("An internal server error occurred - 500\n Error:", err);
    res.status(500).send("An internal server error occurred. Please try again later.");
  }

});

module.exports = app;
