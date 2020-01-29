// File: comment.js
// Description: data functions that handle comments

const pool = require("../utils/mysqlPool").pool;

// get a comment by its ID
function getComment(commentId) {

  return new Promise((resolve, reject) => {

    const sql = "SELECT * FROM Comment WHERE commentId = ?;";
    pool.query(sql, [commentId], (err, results) => {

      if (err) {
        console.log("Error searching for comment");
        reject(err);
      } else {
        resolve(results);
      }
    });

  })
    .catch((err) => {
      throw Error(err);
    });

}
exports.getComment = getComment;

// create a new comment by its ID
function createComment(planId, userId, text) {

  return new Promise((resolve, reject) => {

    const sql = "INSERT INTO Comment (planId, userId, text) VALUES (?, ?, ?);;";
    pool.query(sql, [planId, userId, text], (err) => {

      if (err) {
        console.log("Error adding comment");
        reject(err);
      } else {
        resolve();
      }
    });

  })
    .catch((err) => {
      throw Error(err);
    });

}
exports.createComment = createComment;
