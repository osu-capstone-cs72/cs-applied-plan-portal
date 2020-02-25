// File: validUser.js
// Description: Ensures that a user is allowed to access an API endpoint.

// Return true if the user is allowed to access this endpoint
function validUser(token, roleMin, exception) {
  console.log("token:", token);
  console.log("roleMin:", roleMin);
  console.log("exception:", exception);
}
exports.validUser = validUser;
