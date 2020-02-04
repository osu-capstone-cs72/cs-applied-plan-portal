// File: course.js
// Description: data functions that handle courses

const pool = require("../utils/mysqlPool").pool;

// search for a course using text and a mode setting
// the mode can be courseId, courseCode, or courseName
async function getCourse(searchText, mode) {

  // set sql query based on mode
  let sql = "SELECT * FROM Course WHERE courseId = ?;";
  switch (mode) {
    case "courseCode":
      sql = "SELECT * FROM Course WHERE courseCode LIKE CONCAT('%', ?, '%');";
      break;
    case "courseName":
      sql = "SELECT * FROM Course WHERE courseName LIKE CONCAT('%', ?, '%');";
      break;
  }

  try {
    const results = await pool.query(sql, [searchText]);
    return results[0];
  } catch (err) {
    console.log("Error searching for course");
    throw Error(err);
  }

}
exports.getCourse = getCourse;
