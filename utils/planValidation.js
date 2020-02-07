// File: planValidation.js
// Description: validates a submitted plan against a list of constraints

const pool = require("./mysqlPool").pool;

const CREDITS_MIN = 32;

// checks that the submitted data does not violate any constraints
async function enforceConstraints(userId, planName, courses) {

  try {

    await userConstraint(userId);
    await studentConstraint(userId);
    await zeroCourseConstraint(courses);
    await duplicateCourseConstraint(courses);
    await courseConstraint(courses);
    await restrictionConstraint(courses);
    await creditConstraint(courses);
    return "valid";

  } catch (err) {
    if (err === "Internal error") {
      throw err;
    } else {
      return err;
    }
  }

}
exports.enforceConstraints = enforceConstraints;

// checks that the user exists
async function userConstraint(userId) {

  const violation = "Invalid user ID. Unable to submit plan.";

  try {

    const sql = "SELECT * FROM User WHERE userId=?;";
    const results = await pool.query(sql, userId);

    if (results[0].length === 0) {
      throw violation;
    } else {
      return;
    }

  } catch (err) {
    if (internalError(err, violation)) {
      console.log("Error checking user constraint\n", err);
      throw ("Internal error");
    } else {
      throw err;
    }
  }

}

// checks that the user is a student
async function studentConstraint(userId) {

  const violation = "Only students can submit plans.";

  try {

    const sql = "SELECT * FROM User WHERE userId=? AND role=0;";
    const results = await pool.query(sql, userId);

    if (results[0].length  === 0) {
      throw violation;
    } else {
      return;
    }

  } catch (err) {
    if (internalError(err, violation)) {
      console.log("Error checking student constraint\n", err);
      throw ("Internal error");
    } else {
      throw err;
    }
  }

}

// checks to see if any courses are selected
async function zeroCourseConstraint(courses) {

  if (courses.length === 0) {
    throw "No courses selected.";
  } else {
    return;
  }

}

// checks that no single course is selected more than once
async function duplicateCourseConstraint(courses) {

  const seenCourses = Object.create(null);

  for (let i = 0; i < courses.length; ++i) {
    const courseCode = courses[i];
    if (courseCode in seenCourses) {
      throw "A course was selected more than once.";
    }
    seenCourses[courseCode] = true;
  }
  return;

}

// checks that all courses are valid
async function courseConstraint(courses) {

  const violation = "At least one selected course is invalid.";
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
      throw violation;
    } else {
      return;
    }

  } catch (err) {
    if (internalError(err, violation)) {
      console.log("Error checking course constraint\n", err);
      throw ("Internal error");
    } else {
      throw err;
    }
  }

}

// checks if there are any restrictions on selected courses
async function restrictionConstraint(courses) {

  const violationReq = "A required course was selected.";
  const violationGrad = "A graduate or professional course was selected.";
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
        throw violationReq;
      } else {
        throw violationGrad;
      }
    } else {
      return;
    }

  } catch (err) {
    if (internalError(err, violationReq) && internalError(err, violationGrad)) {
      console.log("Error checking restriction constraint\n", err);
      throw ("Internal error");
    } else {
      throw err;
    }
  }

}

// checks that at least the minimum plan credits are selected
async function creditConstraint(courses) {

  const violation = `Less than ${CREDITS_MIN} credits selected.`;
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
      throw violation;
    } else {
      return;
    }

  } catch (err) {
    if (internalError(err, violation)) {
      console.log("Error checking credit constraint\n", err);
      throw ("Internal error");
    } else {
      throw err;
    }
  }

}

// checks to see if an error is a violation or an internal error
function internalError (err, violation) {
  if (err !== violation) {
    console.log("Internal server error while checking constraints\n", err);
    return true;
  } else {
    return false;
  }
}
