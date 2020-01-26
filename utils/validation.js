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
// Note:
// - An object can have properties that are not in the schema and can still
//   be valid. Extra properties not in schema are ignored in sanitization.
//
// - For request bodies coming from PATCH requests, not all required properties
//   are provided. In these cases, this function checks for "some" required
//   keys instead of "every" key against the schema.
function validateAgainstSchema(obj, schema, isPatch = false) {
  if (isPatch) {
    // object is valid if it exists and there must exist a property in object
    // that is also in the schema and is valid within that schema
    return obj && Object.keys(obj).some(key => {
      hasProperty(schema, key) && validateProperty(obj, key, schema);
    });
  } else {
    // object is valid if it exists and for every required property in schema,
    // the object must also have that key
    return obj && Object.keys(schema).every(key => {
      // a property is valid if it's not required by the schema,
      // otherwise it must pass the validation
      !schema[key].required || validateProperty(obj, key, schema);
    });
  }
}
exports.validateAgainstSchema = validateAgainstSchema;

// Validates a single property of an object against a provided schema.
//
// The property should be already in the schema, but there's a fail-safe that
// returns false if the schema doesn't have the property.
function validateProperty(obj, property, schema) {
  // fail-safe to avoid TypeError when reading property of `undefined`
  if (!hasProperty(schema, property)) {
    return false;
  }

  switch (schema[property].type) {
    case Type.integer:
      return validator.isInt(obj[property] + "", {
        min: schema[property].minValue,
        max: schema[property].maxValue
      });

    case Type.string:
      return validator.isLength(obj[property] + "", {
        min: schema[property].minLength,
        max: schema[property].maxLength
      });

    case Type.timestamp:
      // time format must be ISO 8601, e.g. "2020-05-15T14:30:29Z"
      return validator.isISO8601(obj[property] + "", {
        strict: true
      });
    default:
      return false;
  }
}

// Sanitizes an object using a provided schema by extracting valid properties to
// a new object and returns that object.
//
// Note:
// - This function assumes the object has been validated against the schema.
// - This function does not support nested objects or with arrays inside.
function sanitizeObject(obj, schema) {
  const sanitizedObj = {};
  if (obj) {
    Object.keys(schema).forEach(key => {
      if (hasProperty(obj, key)) {
        sanitizedObj[key] = obj[key];
      }
    });
  }
  return sanitizedObj;
}
exports.sanitizeObject = sanitizeObject;

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
