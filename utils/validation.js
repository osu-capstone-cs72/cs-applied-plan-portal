// File: validation.js
// Description: validates a submitted form against a list of constraints

const validator = require("validator");
const pool = require("./mysqlPool").pool;
const {Type} = require("./type");

const NAME_MIN = 5;
exports.NAME_MIN = NAME_MIN;
const NAME_MAX = 50;
exports.NAME_MAX = NAME_MAX;
const CREDITS_MIN = 32;
exports.CREDITS_MIN = CREDITS_MIN;

// Validates an object against a provided schema.
//
// Returns an empty string (a falsy value) if the object is valid to the schema.
// Otherwise, returns a non-empty string (a truthy value) specifying the
// validation error message.
//
// Note:
// - An object can have properties that are not in the schema and can still be
//   valid.
//
// - Extra properties not in schema are ignored and are not included in the
//   sanitized object.
//
// - For partial objects (e.g. usually those come from PATCH requests), not all
//   properties are provided. In these cases, this function ignores keys not in
//   the schema and only validates the rest.
function getSchemaViolationMessage(obj, schema, isPartialObj = false) {
  // return an error string if the input is not an object
  if (obj !== Object(obj)) {
    return "Constraint violated: Invalid input type\n\n";
  }

  // return an error string if object doesn't have matching keys with schema
  if (Object.keys(obj).every(key => !(key in schema))) {
    return "Constraint violated: Input has no matching key with schema\n\n";
  }

  // at this point, it is guaranteed that the object has some matching keys with
  // the schema and possibly some keys that are not in the schema
  let errorMessage = "";

  if (isPartialObj) {
    // partial-object case: for every property in the object
    Object.keys(obj).forEach(key => {
      // validate if property is in schema, otherwise ignore it
      if (hasProperty(schema, key)) {
        // append an error message if any or an empty string if no error
        errorMessage += getPropertyViolationMessage(obj, key, schema);
      }
    });
  } else {
    // strict-object case: for every property in the schema
    Object.keys(schema).forEach(key => {
      // validate if property is required by schema, otherwise ignore it
      if (schema[key].required) {
        errorMessage += getPropertyViolationMessage(obj, key, schema);
      }
    });
  }

  // final result is still an empty string if there's no schema violation,
  // otherwise it contains validation error messages separated by newlines
  return errorMessage;
}
exports.getSchemaViolationMessage = getSchemaViolationMessage;

// Validates a single property of an object against a provided schema.
//
// Returns an empty string (a falsy value) if the property is valid to the
// schema. Otherwise, returns a non-empty string (a truthy value) specifying the
// validation error message.
//
// Preconditions:
// - Requires the property to be already in the schema.
function getPropertyViolationMessage(obj, property, schema) {
  // if property is not in the schema, return an error string
  // (this should never happen)
  if (!hasProperty(schema, property)) {
    return `Constraint violated: Property "${property}" not in schema\n\n`;
  }

  // if object does not have the property at all, return an error string
  if (!hasProperty(obj, property)) {
    return `Constraint violated: Property "${property}" not in input\n\n`;
  }

  // at this point, it is guaranteed that both object and schema have a matching
  // property
  let isValid;

  // validate the property based on its type
  switch (schema[property].type) {
    case Type.integer:
      isValid = validator.isInt(obj[property] + "", {
        min: schema[property].minValue,
        max: schema[property].maxValue
      });
      break;

    case Type.string:
      isValid = validator.isLength(obj[property] + "", {
        min: schema[property].minLength,
        max: schema[property].maxLength
      });
      break;

    case Type.timestamp:
      // time format must be ISO 8601, e.g. "2020-12-31T23:59:59Z"
      isValid = validator.isISO8601(obj[property] + "", {
        strict: true
      });
      break;

    // if property is not of the allowed types, it's not valid
    default:
      isValid = false;
      break;
  }

  // return an empty string if pass the validator or return a non-empty error
  // string otherwise
  return isValid ? "" : (schema[property].getErrorMessage() + "\n\n");
}

// Sanitizes an object using a provided schema by extracting valid properties to
// a new object and returns that object.
//
// Note:
// - This function assumes the object has been validated against the schema.
// - This function does not support nested objects or with arrays inside.
function sanitizeUsingSchema(obj, schema) {
  const validObj = {};
  if (obj) {
    // since this function assumes the object has been validated against the
    // schema, a property is valid if it is in the schema
    Object.keys(schema).forEach(key => {
      if (hasProperty(obj, key)) {
        validObj[key] = obj[key];
      }
    });
  }
  return validObj;
}
exports.sanitizeUsingSchema = sanitizeUsingSchema;

// checks that the submitted form data does not violate any constraints
// returns a value that can be used to identify which constraint was violated
function enforceConstraints(userId, planName, courses) {

  return userConstraint(userId, planName, courses)
    .then((conData) => studentConstraint(conData[0], conData[1], conData[2]))
    .then((conData) => planNameConstraint(conData[0], conData[1], conData[2]))
    .then((conData) => zeroCourseConstraint(conData[0], conData[1], conData[2]))
    .then((conData) => duplicateCourseConstraint(conData[0], conData[1], conData[2]))
    .then((conData) => courseConstraint(conData[0], conData[1], conData[2]))
    .then((conData) => restrictionConstraint(conData[0], conData[1], conData[2]))
    .then((conData) => creditConstraint(conData[0], conData[1], conData[2]))
    .then(() => {
      console.log("Plan does not violate any constraints");
      return 0;
    })
    .catch((conData) => {
      // check if the error was from a constraint violation
      if (conData[4]) {
        return conData[4];
      } else {
        console.log("Error while trying to check constraints");
        throw Error(conData[3]);
      }
    });

}
exports.enforceConstraints = enforceConstraints;

// checks that the user exists
function userConstraint(userId, planName, courses) {

  return new Promise((resolve, reject) => {

    const sql = "SELECT * FROM User WHERE userId=?;";
    pool.query(sql, userId, (err, results) => {

      if (err) {
        console.log("Error checking user constraint");
        reject([userId, planName, courses, err, 0]);
      } else {

        if (results.length === 0) {
          reject([userId, planName, courses, "", 1]);
        } else {
          resolve([userId, planName, courses, "", 0]);
        }

      }
    });

  });

}

// checks that the user is a student
function studentConstraint(userId, planName, courses) {

  return new Promise((resolve, reject) => {

    const sql = "SELECT * FROM User WHERE userId=? AND role=0;";
    pool.query(sql, userId, (err, results) => {

      if (err) {
        console.log("Error checking student constraint");
        reject([userId, planName, courses, err, 0]);
      } else {

        if (results.length  === 0) {
          reject([userId, planName, courses, "", 2]);
        } else {
          resolve([userId, planName, courses, "", 0]);
        }

      }
    });

  });

}

// checks that the plan name is a valid length
function planNameConstraint(userId, planName, courses) {

  return new Promise((resolve, reject) => {

    if (planName.length < NAME_MIN || planName.length > NAME_MAX) {
      reject([userId, planName, courses, "", 3]);
    } else {
      resolve([userId, planName, courses, "", 0]);
    }

  });

}

// checks to see if any courses are selected
function zeroCourseConstraint(userId, planName, courses) {

  return new Promise((resolve, reject) => {

    if (courses.length === 0) {
      reject([userId, planName, courses, "", 4]);
    } else {
      resolve([userId, planName, courses, "", 0]);
    }

  });

}

// checks that no single course is selected more than once
function duplicateCourseConstraint(userId, planName, courses) {

  return new Promise((resolve, reject) => {

    const seenCourses = Object.create(null);

    for (let i = 0; i < courses.length; ++i) {
      const courseCode = courses[i];
      if (courseCode in seenCourses) {
        reject([userId, planName, courses, "", 5]);
      }
      seenCourses[courseCode] = true;
    }

    resolve([userId, planName, courses, "", 0]);

  });

}

// checks that all courses are valid
function courseConstraint(userId, planName, courses) {

  return new Promise((resolve, reject) => {

    let sql = "SELECT COUNT(*) AS valid FROM Course WHERE courseCode IN (";
    const sqlArray = [];

    // expand the sql string and array based on the number of courses
    courses.forEach((currentValue) => {
      sql += "?,";
      sqlArray.push(currentValue);
    });
    // replace the last character of the sql query with );
    sql = sql.replace(/.$/, ");");

    // find the number of valid courses and check it against the course array
    pool.query(sql, sqlArray, (err, results) => {
      if (err) {
        console.log("Error checking course constraint");
        reject([userId, planName, courses, err, 0]);
      } else {

        if (results[0].valid !== courses.length) {
          reject([userId, planName, courses, "", 6]);
        } else {
          resolve([userId, planName, courses, "", 0]);
        }

      }
    });

  });

}

// checks if there are any restrictions on selected courses
function restrictionConstraint(userId, planName, courses) {

  return new Promise((resolve, reject) => {

    let sql = "SELECT restriction FROM Course WHERE courseCode IN (";
    const sqlArray = [];

    // expand the sql string and array based on the number of courses
    courses.forEach((currentValue) => {
      sql += "?,";
      sqlArray.push(currentValue);
    });
    // replace the last character of the sql query with the end of the query
    sql = sql.replace(/.$/, ") AND restriction > 0 ORDER BY restriction;");

    // check if there were any restrictions and if so, which ones
    pool.query(sql, sqlArray, (err, results) => {
      if (err) {
        console.log("Error checking restriction constraint");
        reject([userId, planName, courses, err, 0]);
      } else {

        if (results.length) {

          if (results[0].restriction === 1) {
            reject([userId, planName, courses, "", 7]);
          } else {
            reject([userId, planName, courses, "", 8]);
          }

        } else {
          resolve([userId, planName, courses, "", 0]);
        }

      }
    });

  });

}

// checks that at the minimum plan credits are selected
function creditConstraint(userId, planName, courses) {

  return new Promise((resolve, reject) => {

    let sql = "SELECT SUM(credits) AS sumCredits FROM Course WHERE courseCode IN (";
    const sqlArray = [];

    // expand the sql string and array based on the number of courses
    courses.forEach((currentValue) => {
      sql += "?,";
      sqlArray.push(currentValue);
    });
    // replace the last character of the sql query with );
    sql = sql.replace(/.$/, ");");

    // check if the sum of credits is less than the min
    pool.query(sql, sqlArray, (err, results) => {
      if (err) {
        console.log("Error checking credit constraint");
        reject([userId, planName, courses, err, 0]);
      } else {

        if (results[0].sumCredits < CREDITS_MIN) {
          reject([userId, planName, courses, "", 9]);
        } else {
          resolve([userId, planName, courses, "", 0]);
        }

      }
    });

  });

}

// A shorthand to check whether an object has a property that is
// neither `null` nor `undefined`.
function hasProperty(obj, property) {
  return obj && obj[property] !== null && obj[property] !== undefined;
}
