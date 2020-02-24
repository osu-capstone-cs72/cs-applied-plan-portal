// File: comment.js
// Description: data functions that handle comments

const pool = require("../services/db/mysqlPool").pool;

// get a comment by its ID
async function getComment(commentId) {

  try {

    const sql = "SELECT * FROM Comment WHERE commentId = ?;";
    const results = await pool.query(sql, [commentId]);
    return results[0];

  } catch (err) {
    console.log("Error searching for comment");
    throw Error(err);
  }

}
exports.getComment = getComment;

// create a new comment
async function createComment(planId, userId, text) {

  try {

    let sql = "INSERT INTO Comment (planId, userId, text) VALUES (?, ?, ?);";
    let results = await pool.query(sql, [planId, userId, text]);
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
