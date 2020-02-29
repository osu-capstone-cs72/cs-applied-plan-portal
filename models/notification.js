// File: notification.js
// Description: data functions that handle notification

const {pool} = require("../services/db/mysqlPool");

// get all notifications owned by a user
async function getNotifications(userId) {

  try {

    const sql = "SELECT * FROM Notification WHERE userId=? AND checked=0;";
    const results = await pool.query(sql, userId);

    return {
      count: results[0].length,
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
async function createNotification(planId, userId, text, type) {

  try {

    // only create a notification if we don't already have one
    // of the same type for the same user on this plan
    let sql = "SELECT * FROM Notification WHERE planId=? AND userId=? " +
      "AND type=? AND checked=0;";
    let results = await pool.query(sql, [planId, userId, type]);

    if (results[0].length) {
      // we already have this notification, do not add a new one
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
async function planNotification(planId, userId, text, type) {

  try {

    // find all users who are interested in this plan
    // who are not the current user
    const sql = "SELECT studentId AS userId FROM Plan WHERE planId=? AND studentId!=? " +
     "UNION " +
     "SELECT userId FROM Comment WHERE planId=? AND userId!=? " +
     "UNION " +
     "SELECT userId FROM PlanReview WHERE planId=? AND userId!=?;";
    const results = await pool.query(sql, [planId, userId, planId, userId, planId, userId]);
    const userList = results[0];

    // send out the notifications (No need to wait)
    for (let i = 0; i < userList.length; i++) {
      console.log("Creating a notification for user", userList[i].userId);
      createNotification(planId, userList[i].userId, text, type);
    }

    return;

  } catch (err) {
    console.log("Error creating notifications for plan");
    throw Error(err);
  }

}
exports.planNotification = planNotification;