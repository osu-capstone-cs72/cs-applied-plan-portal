// File: course.js
// Description: data functions that handle courses

const {pool} = require("../services/db/mysqlPool");
const fetch = require("node-fetch");

// search for courses using text and a mode setting
// the mode can be courseId, courseCode, or courseName
async function getCourse(searchText, mode) {

  // set sql query based on mode
  let sql = "SELECT * FROM Course WHERE courseId = ?;";
  switch (mode) {
    case "courseCode":
      sql = "SELECT * FROM Course WHERE courseCode LIKE CONCAT('%', ?, '%') " +
        "ORDER BY courseCode;";
      break;
    case "courseName":
      sql = "SELECT * FROM Course WHERE courseName LIKE CONCAT('%', ?, '%') " +
        "ORDER BY courseCode;";
      break;
  }

  try {
    const results = await pool.query(sql, [searchText]);
    return {
      courses: results[0]
    };

  } catch (err) {
    console.log("Error searching for courses");
    throw Error(err);
  }

}
exports.getCourse = getCourse;

// get all of the courses from the OSU Course API
async function getLiveCourses() {

  try {

    // set the subject we are searching for
    const subject = "ENG";

    // fetch all courses from the OSU Course API
    const server = "classes.oregonstate.edu";
    const getUrl = `http://${server}/api/?page=fose&route=search&subject=${subject}`;
    let obj = [];

    // create the request body
    const body = {
      other: {
        srcdb: "999999"
      },
      criteria: [{
        field: "subject", value: "ENG"
      }]
    };

    // perform the request
    const results = await fetch(getUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: JSON.stringify(body)
    });
    console.log(results);
    if (results.ok) {
      // we have gotten a valid response
      obj = await results.json();
      console.log(obj);
      console.log(body);
      return {
        courses: obj.results
      };

    } else {

      // we have gotten a response with a bad status
      obj = await results.json();
      throw Error(obj.error);

    }

  } catch (err) {
    console.log("Error searching for live OSU courses");
    throw Error(err);
  }

}
exports.getLiveCourses = getLiveCourses;
