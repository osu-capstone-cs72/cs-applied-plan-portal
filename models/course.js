// File: course.js
// Description: data functions that handle courses

const pool = require("../utils/mysqlPool").pool;

// search for a course using text and a mode setting
// the mode can be courseId, courseCode, or courseName
function getCourse(searchText, mode) {

  return new Promise((resolve, reject) => {

    // set sql query based on mode
    let sql = "SELECT * FROM Course WHERE courseId = ?;";
    switch (mode) {
      case "courseCode":
        sql = "SELECT * FROM Course WHERE courseCode = ?;";
        break;
      case "courseName":
        sql = "SELECT * FROM Course WHERE courseName = ?;";
        break;
    }

    // excute sql query
    pool.query(sql, [searchText], (err, results) => {

      if (err) {
        console.log("Error searching for course");
        reject(err);
      } else {

        if (results.length === 0) {
          resolve(results);
        } else {
          resolve(results[0]);
        }

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
exports.getCourse = getCourse;
