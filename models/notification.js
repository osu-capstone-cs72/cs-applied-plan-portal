// File: notification.js
// Description: data functions that handle notification

const {pool} = require("../services/db/mysqlPool");

// get all notifications owned by a user
async function getNotifications(userId) {

  try {

    const sql = "SELECT * FROM Notification WHERE userId=?;";
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
