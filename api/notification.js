// File: notification.js
// Description: handles routing for notifications

require("path");
const validator = require("validator");
const express = require("express");
const app = express();
const {getNotifications, deleteNotification} = require("../models/notification");
const {requireAuth} = require("../services/auth/auth");


// view a set of notifications
app.get("/", requireAuth, async (req, res) => {

  try {

    const userId = req.auth.userId;
    console.log("View notifications owned by", userId);

    const results = await getNotifications(userId);
    console.log("200: Notification set found\n");
    res.status(200).send(results);

  } catch (err) {
    console.error("500: An internal server error occurred\n Error:", err);
    res.status(500).send({error: "An internal server error occurred. Please try again later."});
  }

});

// delete a notification
app.delete("/:notificationId", requireAuth, async (req, res) => {

  try {

    const userId = req.auth.userId;
    const notificationId = validator.toInt(req.params.notificationId);
    console.log("Delete notification", notificationId);

    const results = await deleteNotification(notificationId, userId);
    if (results.affectedRows === 0) {
      console.error("404: No notification found\n");
      res.status(404).send({error: "No notification found."});
    } else {
      console.log("200: Notification deleted\n");
      res.status(200).send(results);
    }

  } catch (err) {
    console.error("500: An internal server error occurred\n Error:", err);
    res.status(500).send({error: "An internal server error occurred. Please try again later."});
  }

});

module.exports = app;
