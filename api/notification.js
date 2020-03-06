// File: notification.js
// Description: handles routing for notifications

require("path");
const validator = require("validator");
const express = require("express");
const app = express();
const {getNotifications, checkNotification} = require("../models/notification");
const {requireAuth} = require("../services/auth/auth");


// view a set of notifications
app.get("/", requireAuth, async (req, res) => {

  try {

    const userId = req.auth.userId;
    console.log("View notifications owned by", userId);

    const results = await getNotifications(userId);
    if (results.notifications.length === 0) {
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

// set a notification as checked
app.patch("/:notificationId", requireAuth, async (req, res) => {

  try {

    const userId = req.auth.userId;
    const notificationId = validator.toInt(req.params.notificationId);
    console.log("Check notification", notificationId);

    const results = await checkNotification(notificationId, userId);
    if (results.affectedRows === 0) {
      console.error("404: No notification found\n");
      res.status(404).send({error: "No notification found."});
    } else {
      console.log("200: Notification checked\n");
      res.status(200).send(results);
    }

  } catch (err) {
    console.error("500: An internal server error occurred\n Error:", err);
    res.status(500).send({error: "An internal server error occurred. Please try again later."});
  }

});

module.exports = app;
