// File: user.js
// Description: Provides data functions that handle the User entity.

const pool = require("../utils/mysqlPool").pool;

// Creates a new User in the database with the provided User object.
async function createUser(newUser) {
  try {
    const sql = "INSERT INTO User SET ?";
    const results = await pool.query(sql, newUser);

    return results[0];
  } catch (err) {
    console.error("Error creating new User");
    throw Error(err);  // bubble the error up
  }
}
exports.createUser = createUser;

// Fetches information about a User from the database using the provided ID.
async function getUserById(userId) {
  try {
    const sql = "SELECT * FROM User WHERE userId = ?";
    const results = await pool.query(sql, [userId]);

    return results[0];
  } catch (err) {
    console.error("Error fetching User");
    throw Error(err);  // bubble the error up
  }
}
exports.getUserById = getUserById;

// Fetches information about a User from the database using the provided email.
async function getUserByEmail(email) {
  try {
    const sql = "SELECT * FROM User WHERE email = ?";
    const results = await pool.query(sql, [email]);

    return results[0];
  } catch (err) {
    console.error("Error fetching User");
    throw Error(err);  // bubble the error up
  }
}
exports.getUserByEmail = getUserByEmail;

// Fetches a list of Plans associated with a User from the database using the
// provided ID.
async function getUserPlans(userId) {
  try {
    const sql = "SELECT * FROM Plan WHERE studentId = ?";
    const results = await pool.query(sql, [userId]);

    return results[0];
  } catch (err) {
    console.error("Error fetching User's Plans");
    throw Error(err);  // bubble the error up
  }
}
exports.getUserPlans = getUserPlans;

// Authenticates a User with the provided credential. Used when logging in a
// User.
// Returns true if the provided credential is valid. Returns false otherwise.
async function authenticateUser(email) {
  try {
    const user = (await getUserByEmail(email))[0];
    console.log(user);
    // for now, authenticate if the resulting `user` is a valid JS object
    // TODO: Change this accordingly once CAS is integrated into the app
    const authenticated = user === Object(user);

    return authenticated;
  } catch (err) {
    console.error("Error authenticating User");
    throw Error(err);  // bubble the error up
  }
}
exports.authenticateUser = authenticateUser;
