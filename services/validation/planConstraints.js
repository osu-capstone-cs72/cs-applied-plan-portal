// File: planConstraints.js
// Description: constraints that are used when validating plan operations

const {pool} = require("../db/mysqlPool");

const CREDITS_MIN = 32;
const CREDITS_MAX = 50;
const PLANS_MAX = 5;

// checks that the plan exists
async function planConstraint(planId) {

  const violation = "Invalid plan ID:\nPlan does not exist.";

  try {

    const sql = "SELECT * FROM Plan WHERE planId=?;";
    const results = await pool.query(sql, planId);

    if (results[0].length === 0) {
      throw violation;
    } else {
      return;
    }

  } catch (err) {
    if (internalError(err, violation)) {
      console.log("Error checking plan constraint\n", err);
      throw ("Internal error");
    } else {
      throw err;
    }
  }

}
exports.planConstraint = planConstraint;

// checks that the plan does not share a name with another plan by that user
async function nameConstraint(planName, userId, planId) {

  const violation = "Invalid plan name:\nYou already have a plan with this name.";

  try {

    // check to see if this is a new plan or one being edited
    if (arguments.length > 2) {
      const sql = "SELECT planName FROM Plan WHERE planId=?;";
      const results = await pool.query(sql, planId);

      // if the plan being edited already has this name
      // we allow it to keep the same name
      if (results[0][0].planName.toLowerCase() === planName.toLowerCase()) {
        return;
      }

    }

    // check to see if the user already has a plan with this name
    const sql = "SELECT planName FROM Plan WHERE studentId=? AND planName=?;";
    const results = await pool.query(sql, [userId, planName]);

    if (results[0].length === 0) {
      return;
    } else {
      throw violation;
    }

  } catch (err) {
    if (internalError(err, violation)) {
      console.log("Error checking name constraint\n", err);
      throw ("Internal error");
    } else {
      throw err;
    }
  }

}
exports.nameConstraint = nameConstraint;

// checks that the plan has not been accepted, rejected, or is awaiting final review
async function lockedConstraint(planId) {

  const violation = `Plan cannot be modified:\n` +
    `This plan has the "awaiting final review", "accepted", or "rejected" status ` +
    `and may no longer be altered.`;

  try {

    const sql = "SELECT * FROM Plan WHERE planId=? AND (status=3 OR status=0 OR status=4);";
    const results = await pool.query(sql, planId);

    if (results[0].length > 0) {
      throw violation;
    } else {
      return;
    }

  } catch (err) {
    if (internalError(err, violation)) {
      console.log("Error checking locked constraint\n", err);
      throw ("Internal error");
    } else {
      throw err;
    }
  }

}
exports.lockedConstraint = lockedConstraint;

// checks that the user exists
async function userConstraint(userId) {

  const violation = "Invalid user ID:\nUser does not exist, unable to submit plan.";

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
exports.userConstraint = userConstraint;

// checks that the user is a student
async function studentConstraint(userId) {

  const violation = "Invalid user ID:\nOnly students can submit plans.";

  try {

    const sql = "SELECT * FROM User WHERE userId=? AND role=0;";
    const results = await pool.query(sql, userId);

    if (results[0].length === 0) {
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
exports.studentConstraint = studentConstraint;

// checks that the user is an advisor
async function advisorConstraint(userId) {

  const violation = "Invalid user ID:\nOnly advisors can perform this action.";

  try {

    const sql = "SELECT * FROM User WHERE userId=? AND role>0;";
    const results = await pool.query(sql, userId);

    if (results[0].length === 0) {
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
exports.advisorConstraint = advisorConstraint;

// checks to see if any courses are selected
async function zeroCourseConstraint(courses) {

  if (courses.length === 0) {
    throw "Invalid course selection:\nNo courses selected.";
  } else {
    return;
  }

}
exports.zeroCourseConstraint = zeroCourseConstraint;

// checks that no single course is selected more than once
async function duplicateCourseConstraint(courses) {

  const seenCourses = Object.create(null);

  for (let i = 0; i < courses.length; ++i) {
    const courseId = courses[i].courseId;
    if (courseId in seenCourses) {
      throw "Invalid course selection:\nA course was selected more than once.";
    }
    seenCourses[courseId] = true;
  }
  return;

}
exports.duplicateCourseConstraint = duplicateCourseConstraint;

// checks that all courses are valid
async function courseConstraint(courses) {

  const violation = "Invalid course selection:\nAt least one selected course is invalid.";
  let sql = "SELECT COUNT(*) AS valid FROM Course WHERE courseId IN (";
  const sqlArray = [];

  // expand the sql string and array based on the number of courses
  courses.forEach((currentValue) => {
    sql += "?,";
    sqlArray.push(currentValue.courseId);
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
exports.courseConstraint = courseConstraint;

// checks if there are any restrictions on selected courses
async function restrictionConstraint(courses) {

  const violationReq = "Invalid course selection:\nA required course was selected.";
  const violationGrad = "Invalid course selection:\nA graduate or professional course was selected.";
  let sql = "SELECT restriction FROM Course WHERE courseId IN (";
  const sqlArray = [];

  // expand the sql string and array based on the number of courses
  courses.forEach((currentValue) => {
    sql += "?,";
    sqlArray.push(currentValue.courseId);
  });
  // replace the last character of the sql query with the end of the query
  sql = sql.replace(/.$/, ") AND restriction > 0 ORDER BY restriction;");

  try {

    // perform the query
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
exports.restrictionConstraint = restrictionConstraint;

// checks that the submitted credit value of each course
// matches the valid range from the courses in the database
async function courseCreditConstraint(courses) {

  const violation = "Invalid course selection:\nA selected course has an invalid number of credits.";
  let sql = "SELECT credits FROM Course WHERE courseId IN (";
  const sqlArray = [];

  // expand the sql string and array based on the number of courses
  courses.forEach((currentValue) => {
    sql += "?,";
    sqlArray.push(currentValue.courseId);
  });
  // replace the last character of the sql query with the end of the query
  sql = sql.replace(/.$/, ") ORDER BY courseId;");

  try {

    // perform the query
    const results = await pool.query(sql, sqlArray);

    // check each course to ensure that it matches the submitted credits
    for (let i = 0; i < results[0].length; i++) {

      const credits = parseInt(results[0][i].credits, 10);

      // check if the current course has a set credit value or a range
      if (isNaN(credits)) {

        // split the credit range into two separate numbers (min and max)
        const creditArray = credits.split(" to ");
        if (creditArray.length >= 2) {

          // this credit value is a range
          // ensure that the given credit value is in range
          const submittedCredits = parseInt(courses[i].credits, 10);
          const minCredits = parseInt(creditArray[0], 10);
          const maxCredits = parseInt(creditArray[1], 10);
          if (submittedCredits >= minCredits &&
            submittedCredits <= maxCredits && !isNaN(submittedCredits)) {
            continue;
          } else {
            throw violation;
          }

        } else {
          throw violation;
        }

      } else {

        // ensure that the database and submitted credits match
        const submittedCredits = parseInt(courses[i].credits, 10);
        if (submittedCredits === credits) {
          continue;
        } else {
          throw violation;
        }

      }

    }

    // all credits are valid
    return;

  } catch (err) {
    if (internalError(err, violation)) {
      console.log("Error checking course credit constraint\n", err);
      throw ("Internal error");
    } else {
      throw err;
    }
  }

}
exports.courseCreditConstraint = courseCreditConstraint;

// checks to see if the user is allowed to create any more plans
async function limitConstraint(userId) {

  const violation = `Plan limit exceeded:\n` +
    `You may not have more than ${PLANS_MAX} plans that are still awaiting approval.`;
  const sql = "SELECT * FROM Plan WHERE studentId = ? " +
    "AND (status = 1 OR status = 2 OR status = 3);";

  try {

    // perform the query
    const results = await pool.query(sql, userId);

    // see if the plan limit is exceeded
    if (results[0].length >= PLANS_MAX) {
      throw violation;
    } else {
      return;
    }

  } catch (err) {
    if (internalError(err, violation)) {
      console.log("Error checking limit constraint\n", err);
      throw ("Internal error");
    } else {
      throw err;
    }
  }

}
exports.limitConstraint = limitConstraint;

// checks that at least the minimum plan credits are selected
async function planCreditConstraint(courses) {

  const violationMin = `Invalid course selection:\n` +
    `A plan must have at least ${CREDITS_MIN} credits selected.`;
  const violationMax = `Invalid course selection:\n` +
    `A plan must have no more than ${CREDITS_MAX} credits selected.`;

  let sql;
  let creditSum = 0;

  try {

    // find the number of credits in the plan
    for (let i = 0; i < courses.length; i++) {

      // get credits for current course
      sql  = "SELECT credits FROM Course WHERE courseId = ?;";
      const results = await pool.query(sql, courses[i].courseId);

      // check if credits is a value or a range and then add the credits to sum
      if (isNaN(results[0][0].credits)) {
        creditSum += parseInt(courses[i].credits, 10);
      } else {
        creditSum += parseInt(results[0][0].credits, 10);
      }

    }

    // check if the sum of credits is less than the min or greater than the max
    if (creditSum < CREDITS_MIN) {
      throw violationMin;
    } else if (creditSum > CREDITS_MAX) {
      throw violationMax;
    } else {
      return;
    }

  } catch (err) {
    if (internalError(err, violationMin) && internalError(err, violationMax)) {
      console.log("Error checking plan credit constraint\n", err);
      throw ("Internal error");
    } else {
      throw err;
    }
  }

}
exports.planCreditConstraint = planCreditConstraint;

// checks that the user owns the plan or is an advisor
async function ownerConstraint(planId, userId) {

  const violation = "Invalid user ID:\nThis user is not allowed perform this action on this plan.";

  try {

    let sql = "SELECT * FROM User WHERE userId=?;";
    let results = await pool.query(sql, userId);

    // first ensure that the user exists
    if (results[0].length  === 0) {
      throw violation;
    }

    // if the user is a student they must be the plan owner
    if (results[0][0].role === 0) {

      sql = "SELECT * FROM Plan WHERE planId=?;";
      results = await pool.query(sql, planId);

      if (results[0][0].studentId === userId) {
        return;
      } else {
        throw violation;
      }

    } else {
      return;
    }

  } catch (err) {
    if (internalError(err, violation)) {
      console.log("Error checking owner constraint\n", err);
      throw ("Internal error");
    } else {
      throw err;
    }
  }

}
exports.ownerConstraint = ownerConstraint;

//  checks that the user is allowed to delete this plan
async function deleteConstraint(planId, userId) {

  const violation = "Invalid user ID:\nThis user is not allowed to delete this plan.";

  try {

    let sql = "SELECT * FROM User WHERE userId=?;";
    let results = await pool.query(sql, userId);

    // first ensure that the user exists
    if (results[0].length  === 0) {
      throw violation;
    }

    // if the user is a student they must be the plan owner
    if (results[0][0].role === 0) {

      sql = "SELECT * FROM Plan WHERE planId=?;";
      results = await pool.query(sql, planId);

      if (results[0][0].studentId === userId) {
        return;
      } else {
        throw violation;
      }

    } else {

      // only the head advisor can delete a students plan
      if (results[0][0].role === 2) {
        return;
      } else {
        throw violation;
      }

    }

  } catch (err) {
    if (internalError(err, violation)) {
      console.log("Error checking delete constraint\n", err);
      throw ("Internal error");
    } else {
      throw err;
    }
  }

}
exports.deleteConstraint = deleteConstraint;

// checks to see if an error is a violation or an internal error
function internalError (err, violation) {
  if (err !== violation) {
    return true;
  } else {
    return false;
  }
}