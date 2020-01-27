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
    .then((results) => {
      return results;
    })
    .catch((err) => {
      throw Error(err);
    });

}
exports.getComment = getComment;
