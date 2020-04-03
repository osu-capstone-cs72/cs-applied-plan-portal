// File: comment.js
// Description: data functions that handle comments

const {pool} = require("../services/db/mysqlPool");
const {planNotification} = require("./notification");

// create a new comment
async function createComment(planId, userId, text) {

  try {

    // create the new comment
    let sql = "INSERT INTO Comment (planId, userId, text) VALUES (?, ?, ?);";
    let results = await pool.query(sql, [planId, userId, text]);
    const commentId = results[0].insertId;

    // get the time that the comment was created
    sql = "SELECT time FROM Comment WHERE commentId=?;";
    results = await pool.query(sql, [commentId]);
    const time = results[0][0].time;

    // send out notifications about the new comment
    planNotification(planId, userId, 1);

    const obj = {
      insertId: commentId,
      time: time
    };

    return obj;

  } catch (err) {
    console.log("Error adding comment");
    throw Error(err);
  }

}
exports.createComment = createComment;
