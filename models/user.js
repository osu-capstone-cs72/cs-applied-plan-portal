// File: user.js
// Description: data functions that handle users

const pool = require("../utils/mysqlPool").pool;

// search for a list of the plans that a user has created
function getUserPlans(userId) {

  return new Promise((resolve, reject) => {

    const sql = "SELECT * FROM Plan WHERE studentId = ?;";
    pool.query(sql, [userId], (err, results) => {

      if (err) {
        console.log("Error searching for user plans");
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
exports.getUserPlans = getUserPlans;
