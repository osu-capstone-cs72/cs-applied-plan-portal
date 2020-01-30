// File: validation.js
// Description: validates a submitted form against a list of constraints

const NAME_MIN = 5;
exports.NAME_MIN = NAME_MIN;
const NAME_MAX = 50;
exports.NAME_MAX = NAME_MAX;
const CREDITS_MIN = 32;
exports.CREDITS_MIN = CREDITS_MIN;
const pool = require("./mysqlPool").pool;

// checks that the submitted form data does not violate any constraints
// returns a value that can be used to identify which constraint was violated
async function enforceConstraints(userId, planName, courses) {

  try {

    let violation = await userConstraint(userId);
    if (violation !== 0) { return violation; }
    violation = await studentConstraint(userId);
    if (violation !== 0) { return violation; }
    violation = await planNameConstraint(planName);
    if (violation !== 0) { return violation; }
    violation = await zeroCourseConstraint(courses);
    if (violation !== 0) { return violation; }
    violation = await duplicateCourseConstraint(courses);
    if (violation !== 0) { return violation; }
    violation = await courseConstraint(courses);
    if (violation !== 0) { return violation; }
    violation = await restrictionConstraint(courses);
    if (violation !== 0) { return violation; }
    violation = await creditConstraint(userId, planName, courses);
    if (violation !== 0) { return violation; }
    console.log("Plan does not violate any constraints");
    return 0;

  } catch (err) {
    console.log("Error while trying to check constraints");
    throw Error(err);
  }

}
exports.enforceConstraints = enforceConstraints;

// checks that the user exists
async function userConstraint(userId) {

  try {

    const sql = "SELECT * FROM User WHERE userId=?;";
    const results = await pool.query(sql, userId);

    if (results[0].length === 0) {
      return 1;
    } else {
      return 0;
    }

  } catch (err) {
    console.log("Error checking user constraint");
    throw Error(err);
  }

}

// checks that the user is a student
async function studentConstraint(userId) {

  try {

    const sql = "SELECT * FROM User WHERE userId=? AND role=0;";
    const results = await pool.query(sql, userId);

    if (results[0].length  === 0) {
      return 2;
    } else {
      return 0;
    }

  } catch (err) {
    console.log("Error checking student constraint");
    throw Error(err);
  }

}

// checks that the plan name is a valid length
async function planNameConstraint(planName) {

  if (planName.length < NAME_MIN || planName.length > NAME_MAX) {
    return 3;
  } else {
    return 0;
  }

}

// checks to see if any courses are selected
async function zeroCourseConstraint(courses) {

  if (courses.length === 0) {
    return 4;
  } else {
    return 0;
  }

}

// checks that no single course is selected more than once
async function duplicateCourseConstraint(courses) {

  const seenCourses = Object.create(null);

  for (let i = 0; i < courses.length; ++i) {
    const courseCode = courses[i];
    if (courseCode in seenCourses) {
      return 5;
    }
    seenCourses[courseCode] = true;
  }
  return 0;

}

// checks that all courses are valid
async function courseConstraint(courses) {

  let sql = "SELECT COUNT(*) AS valid FROM Course WHERE courseCode IN (";
  const sqlArray = [];

  // expand the sql string and array based on the number of courses
  courses.forEach((currentValue) => {
    sql += "?,";
    sqlArray.push(currentValue);
  });
  // replace the last character of the sql query with );
  sql = sql.replace(/.$/, ");");

  try {

    const results = await pool.query(sql, sqlArray);

    // find the number of valid courses and check it against the course array
    if (results[0][0].valid !== courses.length) {
      return 6;
    } else {
      return 0;
    }

  } catch (err) {
    console.log("Error checking course constraint");
    throw Error(err);
  }

}

// checks if there are any restrictions on selected courses
async function restrictionConstraint(courses) {

  let sql = "SELECT restriction FROM Course WHERE courseCode IN (";
  const sqlArray = [];

  // expand the sql string and array based on the number of courses
  courses.forEach((currentValue) => {
    sql += "?,";
    sqlArray.push(currentValue);
  });
  // replace the last character of the sql query with the end of the query
  sql = sql.replace(/.$/, ") AND restriction > 0 ORDER BY restriction;");

  try {

    const results = await pool.query(sql, sqlArray);

    // check if there were any restrictions and if so, which ones
    if (results[0].length !== 0) {
      if (results[0][0].restriction === 1) {
        return 7;
      } else {
        return 8;
      }
    } else {
      return 0;
    }

  } catch (err) {
    console.log("Error checking restriction constraint");
    throw Error(err);
  }

}

// checks that at the minimum plan credits are selected
async function creditConstraint(userId, planName, courses) {

  let sql = "SELECT SUM(credits) AS sumCredits FROM Course WHERE courseCode IN (";
  const sqlArray = [];

  // expand the sql string and array based on the number of courses
  courses.forEach((currentValue) => {
    sql += "?,";
    sqlArray.push(currentValue);
  });
  // replace the last character of the sql query with );
  sql = sql.replace(/.$/, ");");

  try {

    const results = await pool.query(sql, sqlArray);

    // check if the sum of credits is less than the min
    if (results[0][0].sumCredits < CREDITS_MIN) {
      return 9;
    } else {
      return 0;
    }

  } catch (err) {
    console.log("Error checking credit constraint");
    throw Error(err);
  }

}
