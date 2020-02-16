// File: comment.js
// Description: data functions that handle comments

const pool = require("../utils/mysqlPool").pool;

// create a new review
async function createReview(planId, advisorId, newStatus) {

  try {

    let sql = "BEGIN;" +
    "INSERT INTO PlanReview (planId, advisorId, newStatus) VALUES (?, ?, ?); " +
    "UPDATE Plan SET status=? WHERE planId=?; COMMIT;";
    let results = await pool.query(sql, [planId, advisorId, newStatus, newStatus, planId]);
    const reviewId = results[0][1].insertId;

    sql = "SELECT timeReviewed FROM PlanReview WHERE reviewId=?;";
    results = await pool.query(sql, [reviewId]);

    const obj = {
      insertId: reviewId,
      time: results[0][0].timeReviewed
    };

    return obj;

  } catch (err) {
    console.log("Error adding review");
    throw Error(err);
  }

}
exports.createReview = createReview;
