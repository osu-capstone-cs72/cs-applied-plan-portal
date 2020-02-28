// File: notificationValidation.js
// Description: validates a notification against a list of constraints

// const {pool} = require("../db/mysqlPool");

// checks that the notification can be viewed
async function viewEnforceConstraints(notificationId, userId) {

  try {

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

// checks to see if an error is a violation or an internal error
function internalError (err, violation) {
  if (err !== violation) {
    return true;
  } else {
    return false;
  }
}
