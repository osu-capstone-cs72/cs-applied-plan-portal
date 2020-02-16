// File: comment.js
// Description: data functions that handle comments

const pool = require("../utils/mysqlPool").pool;

// create a new review
async function createReview(planId, advisorId, newStatus) {

  try {

    const sql = "BEGIN;" +
    "INSERT INTO PlanReview (planId, advisorId, newStatus) VALUES (?, ?, ?); " +
    "UPDATE Plan SET status=? WHERE planId=?; COMMIT;";
    const results = await pool.query(sql, [planId, advisorId, newStatus, newStatus, planId]);
    return {insertId: results[0][1].insertId};

  } catch (err) {
    console.log("Error adding review");
    throw Error(err);
  }

}
exports.createReview = createReview;
