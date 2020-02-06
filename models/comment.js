// File: comment.js
// Description: data functions that handle comments

const pool = require("../utils/mysqlPool").pool;

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

// create a new comment by its ID
async function createComment(planId, userId, text) {

  try {

    const sql = "INSERT INTO Comment (planId, userId, text) VALUES (?, ?, ?);;";
    const results = await pool.query(sql, [planId, userId, text]);
    return {insertId: results[0].insertId};

  } catch (err) {
    console.log("Error adding comment");
    throw Error(err);
  }

}
exports.createComment = createComment;
