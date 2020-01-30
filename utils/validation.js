// File: validation.js
// Description: validates a submitted form against a list of constraints

const pool = require("./mysqlPool").pool;

const NAME_MIN = 5;
const NAME_MAX = 50;
const CREDITS_MIN = 32;

const V1 = "Invalid ONID. Unable to submit plan.";
const V2 = "Only students can submit plans.";
const V3 = `The plan name must be between ${NAME_MIN} ` +
`and ${NAME_MAX} characters long.`;
const V4 = "No courses selected.";
const V5 = "A course was selected more than once.";
const V6 = "At least one selected course is invalid.";
const V7 = "A required course was selected.";
const V8 = "A graduate or professional/technical course was selected.";
const V9 = `Less than ${CREDITS_MIN} credits selected.`;

// constructor for a validation object
// tracks value and message of a constraint violation
function Validator(value, message) {
  this.value = value;
  this.message = message;
}

// checks that the submitted form data does not violate any constraints
// returns a value that can be used to identify which constraint was violated
async function enforceConstraints(userId, planName, courses) {

  try {

    let violation = new Validator(0, "");
    violation = await userConstraint(userId);
    if (violation.value !== 0) { return violation; }
    violation = await studentConstraint(userId);
    if (violation.value !== 0) { return violation; }
    violation = await planNameConstraint(planName);
    if (violation.value !== 0) { return violation; }
    violation = await zeroCourseConstraint(courses);
    if (violation.value !== 0) { return violation; }
    violation = await duplicateCourseConstraint(courses);
    if (violation.value !== 0) { return violation; }
    violation = await courseConstraint(courses);
    if (violation.value !== 0) { return violation; }
    violation = await restrictionConstraint(courses);
    if (violation.value !== 0) { return violation; }
    violation = await creditConstraint(userId, planName, courses);
    if (violation.value !== 0) { return violation; }
    console.log("Plan does not violate any constraints");
    return violation;

  } catch (err) {
    console.log("Error while trying to check constraints");
    throw Error(err);
  }

}
exports.enforceConstraints = enforceConstraints;

// checks that the user exists
async function userConstraint(userId) {

  try {

    // don't bother checking an empty string
    if (userId.length === 0) { return new Validator(1, V1); }

    const sql = "SELECT * FROM User WHERE userId=?;";
    const results = await pool.query(sql, userId);

    if (results[0].length === 0) {
      return new Validator(1, V1);
    } else {
      return new Validator(0, "");
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
      return new Validator(2, V2);
    } else {
      return new Validator(0, "");
    }

  } catch (err) {
    console.log("Error checking student constraint");
    throw Error(err);
  }

}

// checks that the plan name is a valid length
async function planNameConstraint(planName) {

  if (planName.length < NAME_MIN || planName.length > NAME_MAX) {
    return new Validator(3, V3);
  } else {
    return new Validator(0, "");
  }

}

// checks to see if any courses are selected
async function zeroCourseConstraint(courses) {

  if (courses.length === 0) {
    return new Validator(4, V4);
  } else {
    return new Validator(0, "");
  }

}

// checks that no single course is selected more than once
async function duplicateCourseConstraint(courses) {

  const seenCourses = Object.create(null);

  for (let i = 0; i < courses.length; ++i) {
    const courseCode = courses[i];
    if (courseCode in seenCourses) {
      return new Validator(5, V5);
    }
    seenCourses[courseCode] = true;
  }
  return new Validator(0, "");

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
      return new Validator(6, V6);
    } else {
      return new Validator(0, "");
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
        return new Validator(7, V7);
      } else {
        return new Validator(8, V8);
      }
    } else {
      return new Validator(0, "");
    }

  } catch (err) {
    console.log("Error checking restriction constraint");
    throw Error(err);
  }

}

// checks that at least the minimum plan credits are selected
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
      return new Validator(9, V9);
    } else {
      return new Validator(0, "");
    }

  } catch (err) {
    console.log("Error checking credit constraint");
    throw Error(err);
  }

}
