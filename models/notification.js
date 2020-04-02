// File: notification.js
// Description: data functions that handle notification

const {pool} = require("../services/db/mysqlPool");
const {formatStatus} = require("../services/format/format");

// get all notifications owned by a user
async function getNotifications(userId) {

  try {

    const sql = "SELECT * FROM Notification WHERE userId=? AND checked=0;";
    const results = await pool.query(sql, userId);

    return {
      notifications: results[0]
    };

  } catch (err) {
    console.log("Error getting notifications");
    throw Error(err);
  }

}
exports.getNotifications = getNotifications;

// check a notification by id
async function checkNotification(notificationId, userId) {

  try {

    const sql = "UPDATE Notification SET checked=1 WHERE notificationId=? AND userId=?;";
    const results = await pool.query(sql, [notificationId, userId]);
    return {
      affectedRows: results[0].affectedRows
    };

  } catch (err) {
    console.log("Error checking notification");
    throw Error(err);
  }

}
exports.checkNotification = checkNotification;

// create a new notification
async function createNotification(planId, userId, type, status, planName, actorName) {

  try {

    // construct the new notification text based on
    // the type, status, plan name, and actor name
    let text;
    if (type === 1) {

      text = `${actorName} has added a new comment to the plan "${planName}".`;

    } else {

      const statusString = formatStatus(status);
      text = `The plan "${planName}" has been set to "${statusString}" by ${actorName}.`;

    }

    // prevent duplicate notifications from being created by
    // comparing notification messages
    let sql = "SELECT text FROM Notification WHERE userId = ? " +
      "AND text = ? AND checked = 0;";
    let results = await pool.query(sql, [userId, text]);

    if (results[0].length) {
      return;
    }

    // create the new notification
    sql = "INSERT INTO Notification (planId, userId, text, type, checked) " +
      "VALUES (?, ?, ?, ?, 0)";
    results = await pool.query(sql, [planId, userId, text, type]);
    return;

  } catch (err) {
    console.log("Error creating notification");
    throw Error(err);
  }

}
exports.createNotification = createNotification;

// notify all users who are watching a plan
async function planNotification(planId, userId, type) {

  try {

    // find all users who are interested in this plan
    // who are not the current user
    let sql = "SELECT studentId AS userId FROM Plan WHERE planId=? AND studentId!=? " +
      "UNION " +
      "SELECT userId FROM Comment WHERE planId=? AND userId!=? " +
      "UNION " +
      "SELECT userId FROM PlanReview WHERE planId=? AND userId!=?;";
    let results = await pool.query(sql, [planId, userId, planId, userId, planId, userId]);
    const userList = results[0];

    // get the plan name and status
    sql = "SELECT * " +
      "FROM Plan WHERE planId = ?";
    results = await pool.query(sql, planId);
    const planName = results[0][0].planName;
    const status = results[0][0].status;

    // get the actor name (user who performed the action)
    sql = "SELECT CONCAT(firstName, ' ', lastName) AS actorName " +
      "FROM User WHERE userId = ?";
    results = await pool.query(sql, userId);
    const actorName = results[0][0].actorName;

    // send out the notifications (No need to wait)
    for (let i = 0; i < userList.length; i++) {
      console.log("Creating a notification for user", userList[i].userId);
      createNotification(planId, userList[i].userId, type, status, planName, actorName);
    }

    return;

  } catch (err) {
    console.log("Error creating notifications for plan");
    throw Error(err);
  }

}
exports.planNotification = planNotification;


// add a notification for the current head advisor for when the
// database of courses starts and finishes being updated
async function courseUpdateNotification(userId, state) {

  try {

    // get the current time
    const time = new Date().toLocaleTimeString("en-US", {dateStyle: "medium", timeStyle: "short"});

    // create a different message based on if the course update process
    // is just starting, finishing, or has an error
    let notificationText;
    if (state === 1) {
      notificationText = `Began updating courses at ${time}.`;
    } else if (state === 2) {
      notificationText = `Finished updating courses at ${time}.`;
    } else {
      notificationText = `Error completing course update at ${time}`;
    }

    const sql = "INSERT INTO Notification (planId, userId, text, type, checked) " +
      "VALUES (0, ?, ?, 3, 0)";
    const results = await pool.query(sql, [userId, notificationText]);
    return {
      affectedRows: results[0].affectedRows
    };

  } catch (err) {
    console.log("Error checking notification");
    throw Error(err);
  }

}
exports.courseUpdateNotification = courseUpdateNotification;