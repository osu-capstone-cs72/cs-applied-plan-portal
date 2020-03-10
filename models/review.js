// File: comment.js
// Description: data functions that handle comments

const {pool} = require("../services/db/mysqlPool");
const {planNotification} = require("./notification");

// create a new review
async function createReview(planId, userId, status) {

  try {
    // create the new review
    let sql = "BEGIN;" +
    "INSERT INTO PlanReview (planId, userId, status) VALUES (?, ?, ?); " +
    "UPDATE Plan SET status=? WHERE planId=?; COMMIT;";
    let results = await pool.query(sql, [planId, userId, status, status, planId]);
    const reviewId = results[0][1].insertId;

    sql = "SELECT time FROM PlanReview WHERE reviewId=?;";
    results = await pool.query(sql, reviewId);

    const obj = {
      insertId: reviewId,
      time: results[0][0].time
    };

    // send out notifications about the new status
    planNotification(planId, userId, 2);

    return obj;

  } catch (err) {
    console.log("Error adding review");
    throw Error(err);
  }

}
exports.createReview = createReview;
