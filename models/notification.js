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
