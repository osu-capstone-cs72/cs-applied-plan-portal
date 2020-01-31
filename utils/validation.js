// File: validation.js
// Description: validates a submitted form against a list of constraints

const NAME_MIN = 5;
const NAME_MAX = 50;
const CREDITS_MIN = 32;

const pool = require("./mysqlPool").pool;

// Phrased this way to allow for top-level error instantiation without a wrapper object.
const { UserError, PrivilegeError, PlanNameError, EmptyPlanError, DuplicateCourseError, InvalidCourseError, CourseRestrictionError, PlanCreditsError, InternalValidationError } = require("./errors");

// Check that the submitted form data complies with all constraints.
// Returns a ValidationError instance with the properties "status" and "message."
const enforceConstraints = async (userId, planName, courses) => {
  return await Promise.all([
    checkUserValid(userId),
    checkUserStudent(userId),
    checkPlanName(planName),
    checkPlanEmpty(courses),
    checkDuplicateCourses(courses),
    checkInvalidCourses(courses),
    checkRestrictedCourses(courses),
    checkPlanCredits(courses)
  ]).then(() => {
    console.log("The plan does not violate any constraints.");
    return null;
  }).catch(error => {
    console.log(`The plan failed to validate with a ${error.name}.`);
    return error;
  });
};

// Check that the user exists in the database.
const checkUserValid = async (userId) => new Promise(function(resolve, reject) {
  const sql = "SELECT * FROM User WHERE userId=?;";
  pool.query(sql, userId, function(error, results) {
    if (error) {
      console.log("An error occurred while checking the user constraint.");
      reject(new InternalValidationError());
    } else {
      if (results.length === 0) {
        reject(new UserError());
      } else {
        resolve();
      }
    }
  });
});

// Check that the user is a student.
const checkUserStudent = async (userId) => new Promise(function(resolve, reject) {
  const sql = "SELECT * FROM User WHERE userId=? AND role=0;";
  pool.query(sql, userId, function(error, results) {
    if (error) {
      console.log("An error occurred while checking the student constraint.");
      reject(new InternalValidationError());
    } else {
      if (results.length === 0) {
        reject(new PrivilegeError());
      } else {
        resolve();
      }
    }
  });
});

// Check that the plan's name has a valid length.
const checkPlanName = async (planName) => new Promise(function(resolve, reject) {
  if (planName.length < NAME_MIN) {
    reject(new PlanNameError(`The plan's name must be at least ${NAME_MIN} characters.`));
  } else if (planName.length > NAME_MAX) {
    reject(new PlanNameError(`The plan's name must not exceed ${NAME_MAX} characters.`));
  } else {
    resolve();
  }
});

// Check whether the plan contains any courses.
const checkPlanEmpty = async (courses) => new Promise(function(resolve, reject) {
  if (courses.length === 0) {
    reject(new EmptyPlanError());
  } else {
    resolve();
  }
});

// Check that no courses have been included more than once.
const checkDuplicateCourses = async (courses) => new Promise(function(resolve, reject) {
  // Confirm that every course in the plan is the last (only) instance of that plan.
  try {
    courses.forEach(code => {
      if (courses.indexOf(code) !== courses.lastIndexOf(code)) {
        throw new DuplicateCourseError(code);
      }
    });
  } catch (err) {
    reject(err);
  }
  resolve();
});

// Check that all courses are valid.
const checkInvalidCourses = async (courses) => new Promise(function(resolve, reject) {
  let sql = "SELECT COUNT(*) AS valid FROM Course WHERE courseCode IN (";
  let sqlArray = [];
  
  // Expand the SQL string and array based on the number of courses.
  courses.forEach((currentValue) => {
    sql += "?,";
    sqlArray.push(currentValue);
  });
  
  // Replace the last character of the SQL query with );
  sql = sql.replace(/.$/, ");");
  
  // Find the number of valid courses and check it against the course array.
  pool.query(sql, sqlArray, (err, results) => {
    if (err) {
      console.log("An error occurred while checking invalid courses.");
      reject(new InternalValidationError(err));
    } else {
       if (results[0].valid !== courses.length) {
        reject(new InvalidCourseError());
      } else {
        resolve();
      }
    }
  });
});

// Check if there are any restrictions on the selected courses.
const checkRestrictedCourses = async (courses) => new Promise(function(resolve, reject) {
  let sql = "SELECT restriction FROM Course WHERE courseCode IN (";
  let sqlArray = [];
  
  // Expand the SQL string and array based on the number of courses.
  courses.forEach((currentValue) => {
    sql += "?,";
    sqlArray.push(currentValue);
  });
  
  // Replace the last character of the SQL query with the end of the query.
  sql = sql.replace(/.$/, ") AND restriction > 0 ORDER BY restriction;");
  
  // Check if any courses are restricted, and if so, which ones.
  pool.query(sql, sqlArray, (err, results) => {
    if (err) {
      console.log("An error occurred while checking course restrictions.");
      reject(new InternalValidationError(err));
    } else {
      if (results.length) {
        if (results[0].restriction === 1) {
          reject(new CourseRestrictionError("A required course was selected."));
        } else {
          reject(new CourseRestrictionError("A graduate, professional, or technical course was selected."));
        }
      } else {
        resolve();
      }
    }
  });
});

// Check that the plan contains the minimum number of credits.
const checkPlanCredits = async (courses) => new Promise(function(resolve, reject) {
  let sql = "SELECT SUM(credits) AS sumCredits FROM Course WHERE courseCode IN (";
  let sqlArray = [];
  
  // Expand the SQL string and array based on the number of courses.
  courses.forEach((currentValue) => {
    sql += "?,";
    sqlArray.push(currentValue);
  });
  
  // Replace the last character of the SQL query with );
  sql = sql.replace(/.$/, ");");
  
  // Check whether the sum of credits is less than the minimum value.
  pool.query(sql, sqlArray, (err, results) => {
    if (err) {
      console.log("An error occurred while checking the plan's total credits.");
      reject(new InternalValidationError(err));
    } else {
      let sum = results[0].sumCredits;
      if (sum < CREDITS_MIN) {
        reject(new PlanCreditsError(`The plan must have at least ${CREDITS_MIN} credits, but only ${sum} were selected.`));
      } else {
        resolve();
      }
    }
  });
});

exports.enforceConstraints = enforceConstraints;
