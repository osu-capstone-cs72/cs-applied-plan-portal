// File: planValidation.js
// Description: validates a submitted plan against a list of constraints

const pool = require("./mysqlPool").pool;

const CREDITS_MIN = 32;

// checks that the submitted data does not violate any constraints
async function createEnforceConstraints(userId, courses) {

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
exports.createEnforceConstraints = createEnforceConstraints;

// checks that the submitted data does not violate any patch constraints
async function patchEnforceConstraints(planId, courses, userId) {

  try {

    await planConstraint(planId);
    await lockedConstraint(planId);

    if (courses !== 0) {
      await zeroCourseConstraint(courses);
      await duplicateCourseConstraint(courses);
      await courseConstraint(courses);
      await restrictionConstraint(courses);
      await creditConstraint(courses);
      await ownerConstraint(planId, userId);
    }

    return "valid";

  } catch (err) {
    if (err === "Internal error") {
      throw err;
    } else {
      return err;
    }
  }

}
exports.patchEnforceConstraints = patchEnforceConstraints;

// checks that the submitted data does not violate any view constraints
async function viewEnforceConstraints(planId, userId) {

  try {

    await planConstraint(planId);
    await ownerConstraint(planId, userId);
    return "valid";

  } catch (err) {
    if (err === "Internal error") {
      throw err;
    } else {
      return err;
    }
  }

}
exports.viewEnforceConstraints = viewEnforceConstraints;

// checks that the submitted data does not violate any view constraints
async function statusEnforceConstraints(userId) {

  try {

    await userConstraint(userId);
    await advisorConstraint(userId);
    return "valid";

  } catch (err) {
    if (err === "Internal error") {
      throw err;
    } else {
      return err;
    }
  }

}
exports.statusEnforceConstraints = statusEnforceConstraints;

// checks that the submitted data does not violate any delete constraints
async function deleteEnforceConstraints(planId, userId) {

  try {

    await planConstraint(planId);
    await lockedConstraint(planId);
    await deleteConstraint(planId, userId);
    return "valid";

  } catch (err) {
    if (err === "Internal error") {
      throw err;
    } else {
      return err;
    }
  }

}
exports.deleteEnforceConstraints = deleteEnforceConstraints;

// checks that the submitted data does not violate any activity constraints
async function activityEnforceConstraints(planId, userId) {

  try {

    await planConstraint(planId);
    await ownerConstraint(planId, userId);
    return "valid";

  } catch (err) {
    if (err === "Internal error") {
      throw err;
    } else {
      return err;
    }
  }

}
exports.activityEnforceConstraints = activityEnforceConstraints;

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

// checks to see if any courses are selected
async function zeroCourseConstraint(courses) {

  if (courses.length === 0) {
    throw "Invalid course selection:\nNo courses selected.";
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
      throw "Invalid course selection:\nA course was selected more than once.";
    }
    seenCourses[courseCode] = true;
  }
  return;

}

// checks that all courses are valid
async function courseConstraint(courses) {

  const violation = "Invalid course selection:\nAt least one selected course is invalid.";
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

  const violationReq = "Invalid course selection:\nA required course was selected.";
  const violationGrad = "Invalid course selection:\nA graduate or professional course was selected.";
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

  const violation = `Invalid course selection:\nLess than ${CREDITS_MIN} credits selected.`;
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

//  checks that the user owns the plan or is an advisor
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

// checks to see if an error is a violation or an internal error
function internalError (err, violation) {
  if (err !== violation) {
    return true;
  } else {
    return false;
  }
}
