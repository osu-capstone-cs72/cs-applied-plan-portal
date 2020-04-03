// File: course.js
// Description: data functions that handle courses

const {pool} = require("../services/db/mysqlPool");
const fetch = require("node-fetch");
const {courseUpdateNotification} = require("./notification");
const {Required} = require("../entities/required");
const {Subject} = require("../entities/subject");

// Search for courses using text.
// The text is used to search by
// courseCode and courseName.
async function getCourse(searchText, filterValue) {

  try {

    // search for courses by subject
    let sqlArray = [];
    let sql = "SELECT * " +
    "FROM Course " +
    "WHERE True ";

    if (searchText !== "*") {
      sql += "AND courseCode LIKE CONCAT('%', ?, '%')";
      sqlArray.push(searchText);
    }

    if (filterValue !== "*") {
      sql += "AND courseCode LIKE CONCAT('%', ?, ' ', '%')";
      sqlArray.push(filterValue);
    }

    sql += "ORDER BY courseCode, courseName;";

    // perform the query
    let results = await pool.query(sql, sqlArray);

    // if there are no results then search by course name
    if (results[0].length) {
      return {
        courses: results[0]
      };
    }

    // search for courses by course name
    sqlArray = [];
    sql = "SELECT * " +
    "FROM Course " +
    "WHERE True ";

    if (searchText !== "*") {
      sql += "AND courseName LIKE CONCAT('%', ?, '%')";
      sqlArray.push(searchText);
    }

    if (filterValue !== "*") {
      sql += "AND courseCode LIKE CONCAT('%', ?, ' ', '%')";
      sqlArray.push(filterValue);
    }

    sql += "ORDER BY courseCode, courseName;";

    // perform the query
    results = await pool.query(sql, sqlArray);

    return {
      courses: results[0]
    };

  } catch (err) {
    console.log("Error searching for courses");
    throw Error(err);
  }

}
exports.getCourse = getCourse;

// get all of the courses from the OSU Course API and submit the courses to
// the courses table of the application database
async function getLiveCourses(userId) {

  try {

    // start by making a notification that the update process has begun
    await courseUpdateNotification(userId, 1);

    // set the subject we are searching for
    let subject;
    const courses = [];

    // get all courses from each subject
    // check if the course is a required course
    for (let i = 0; i < Subject.codes.length; i++) {

      // set the current subject to get courses from
      subject = Subject.codes[i];

      // fetch a list of courses for the current subject
      const server = "classes.oregonstate.edu";
      const getUrl = `https://${server}/api/?page=fose&route=search&subject=${subject}`;
      let obj = [];

      // create the request body
      const body = {
        other: {
          srcdb: "999999"
        },
        criteria: [{
          field: "subject", value: subject
        }]
      };

      // perform the request to get the list
      const results = await fetch(getUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: JSON.stringify(body)
      });

      if (results.ok) {

        // we have gotten a valid response
        obj = await results.json();

        let course;
        let previousTitle = "";

        // for each listed course get the details of that course
        for (let i = 0; i < obj.results.length; i++) {

          course = obj.results[i];
          if (course.title !== previousTitle) {

            // get data about each course and ensure that it is in the
            // application course table of the database
            previousTitle = course.title;
            const detailed = await getCourseDetails(course.crn, course.title, course.code);
            courses.push(detailed);

          }

        }

      }

    }

    // the courses have been updated successfully,
    // send a notification to the head advisor
    courseUpdateNotification(userId, 2);

    return {
      courses: courses
    };

  } catch (err) {
    console.log("Error searching for live OSU courses");
    courseUpdateNotification(userId, 3);
    throw Error(err);
  }

}
exports.getLiveCourses = getLiveCourses;

// fetch detailed info for a specific course
async function getCourseDetails(crn, title, code) {

  try {

    const server = "classes.oregonstate.edu";
    const getUrl = `https://${server}/api/?page=fose&route=details`;
    let obj = [];

    // create the request body
    const body = {
      group: `code:${code}`,
      key: `crn:${crn}`,
      srcdb: "999999",
      matched: `title:${title}`
    };

    // perform the request to get the detailed info
    const results = await fetch(getUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: JSON.stringify(body)
    });

    if (results.ok) {

      // we have gotten a valid response
      obj = await results.json();

      // see if the course should be restricted
      const restriction = getRestrictionValue(code);

      // clean up description to not include HTML elements
      let description = obj.description.replace(/(<([^>]+)>)/ig, "");
      description = description.replace(/&quot;/g, '"');

      // clean up the prerequisites string to not include HTML elements
      let prerequisites = obj.registration_restrictions.replace(/(<([^>]+)>)/ig, "");
      prerequisites = prerequisites.replace("&quot", `"`);

      // create the course object
      const course = {
        courseName: title,
        courseCode: code,
        description: description,
        prerequisites: prerequisites,
        credits: obj.hours_html,
        restriction: restriction
      };

      // submit the course to the database
      await submitCourse(course);

      // return the course data
      return {
        courseName: course.courseName,
        courseCode: course.courseCode,
        description: course.description,
        prerequisites: course.prerequisites,
        credits: course.credits,
        restriction: course.restriction
      };

    } else {

      // we have gotten a response with a bad status
      obj = await results.json();
      throw Error(obj.error);

    }

  } catch (err) {
    console.log("Error getting detailed course data");
    throw Error(err);
  }

}

// get the restriction value of a course using the course code
function getRestrictionValue(code) {

  // get just the number portion of the course code
  const courseNumber = code.match(/(\d+)/);

  // check if the course is a required course
  for (let i = 0; i < Required.courses.length; i++) {
    if (Required.courses[i] === code) {
      return 1;
    }
  }

  // if the course is level 500+ then it is restricted
  if (courseNumber[0] >= 500) {
    return 2;
  }

  // This is a valid course.
  // Return a restriction value of zero.
  return 0;

}

// update or add a course to the course table of the database
async function submitCourse(course) {

  try {

    // check if the course is already in the database
    let sql = "SELECT * FROM Course WHERE courseCode = ? AND courseName = ?;";
    let results = await pool.query(sql, [course.courseCode, course.courseName]);

    // if this is a new course add it, otherwise update the course
    if (results[0].length) {

      // update the course
      sql = "UPDATE Course " +
        "SET credits = ?, courseName = ?, courseCode = ?, restriction = ?, " +
        "description = ?, prerequisites = ? " +
        "WHERE courseCode = ? AND courseName = ?;";
      results = await pool.query(sql, [course.credits, course.courseName,
        course.courseCode, course.restriction, course.description, course.prerequisites,
        course.courseCode, course.courseName]);

      console.log("Updated course:", course.courseCode, "-", course.courseName);

      return {
        courseId: 0
      };

    } else {

      // insert the new course
      sql = "INSERT INTO Course (credits, courseName, courseCode, " +
        "restriction, description, prerequisites) " +
        "VALUES (?, ?, ?, ?, ?, ?);";
      results = await pool.query(sql, [course.credits, course.courseName,
        course.courseCode, course.restriction, course.description,
        course.prerequisites]);

      console.log("Added new course:", course.courseCode, "-", course.courseName);

      return {
        courseId: results[0].insertId
      };

    }

  } catch (err) {
    console.log("Error adding course to database");
    throw Error(err);
  }

}