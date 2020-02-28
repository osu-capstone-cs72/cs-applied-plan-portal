// File: notification.js
// Description: handles routing for notifications

require("path");
const express = require("express");
const app = express();
const {getNotifications} = require("../models/notification");
// const {viewEnforceConstraints} = require("../services/validation/notificationValidation");
const {requireAuth} = require("../services/auth/auth");


// view a set of notifications
app.get("/", requireAuth, async (req, res) => {

  try {

    const userId = req.auth.userId;
    console.log("View notifications owned by", userId);

    const results = await getNotifications(userId);
    if (results.planId === 0) {
      console.error("404: No notifications found\n");
      res.status(404).send({error: "No notifications found."});
    } else {
      console.log("200: Notifications found\n");
      res.status(200).send(results);
    }

  } catch (err) {
    console.error("500: An internal server error occurred\n Error:", err);
    res.status(500).send({error: "An internal server error occurred. Please try again later."});
  }

});

module.exports = app;
