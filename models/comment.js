// File: comment.js
// Description: data functions that handle comments

const {pool} = require("../services/db/mysqlPool");
const {planNotification} = require("./notification");

// create a new comment
async function createComment(planId, userId, text) {

  try {

    // start by sending out notifications when we add a comment
    let sql = "SELECT planName FROM Plan WHERE planId=?;";
    let results = await pool.query(sql, planId);
    const planName = results[0][0].planName;
    const notificationText = `The plan "${planName}" has new comments.`;
    planNotification(planId, userId, notificationText, 1);

    // create the new comment
    sql = "INSERT INTO Comment (planId, userId, text) VALUES (?, ?, ?);";
    results = await pool.query(sql, [planId, userId, text]);
    const commentId = results[0].insertId;

    sql = "SELECT time FROM Comment WHERE commentId=?;";
    results = await pool.query(sql, [commentId]);

    const obj = {
      insertId: commentId,
      time: results[0][0].time
    };

    return obj;

  } catch (err) {
    console.log("Error adding comment");
    throw Error(err);
  }

}
exports.createComment = createComment;
