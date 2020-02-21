// File: auth.js
// Description: Provides functions that handle the authentication process.

const assert = require("assert");
const needle = require("needle");
const jwt = require("jsonwebtoken");
const url = require("url");
const xml2js = require("xml2js");

const {Role} = require("./role");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// Generates an auth token for a specific User with the provided ID and role.
// Token is a JSON web token which expires in 24 hours.
function generateAuthToken(userId, userRole) {
  const payload = {
    sub: userId,
    role: userRole
  };
  const token = jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: "24h"});
  return token;
}
exports.generateAuthToken = generateAuthToken;

function getTokenExpirationTime(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET_KEY);

    // JWT's expiration time is in seconds and in UNIX time format, thus
    // convert the expiration time to milliseconds before constructing the Date
    return new Date(payload.exp * 1000);
  } catch (err) {
    // if there was any error, return null
    return null;
  }
}
exports.getTokenExpirationTime = getTokenExpirationTime;

// This middleware function routes to the next middleware if and only if the
// provided credential is valid. Otherwise, respond with the 401 error and an
// error message.
//
// Put this function before the middleware handler of any API route that
// requires authorization.
//
// This function assumes the use of a Bearer token in the Cookie of the incoming
// request.
//
// USAGE: FOLLOW THESE STEPS:
//   1. Assign a constant to `req.auth` by `const auth = req.auth;`.
//   2. Clear `req.auth` immediately afterwards by `req.auth = {};`. This action
//      makes the payload info available to the local scope of the middleware
//      handler function only (i.e. not hanging around in a field of `req`).
//   3. Check `auth.userId` and `auth.userRole` in the middleware.
//      They are either `undefined` or equal to the expected value that the
//      verified payload provides.
//
//   - No need to check `req` and `req.auth` in the if statements because they
//     are always null-safe.
//   - No need to check the types and value ranges of `userId` and `userRole`
//     because the assertions in this function already does that job.
function requireAuth(req, res, next) {
  // first of all, clear the field that will be used for holding the payload
  req.auth = {};

  try {
    // ensure that the cookie has the JWT field
    assert(req.signedCookies.accessToken, "No access token in cookie");

    // get token from the cookies
    const tokenParts = req.signedCookies.accessToken.split(" ");
    const token = tokenParts[0] === "Bearer" ? tokenParts[1] : null;

    // use the jwt service to verify the token
    // this function call throws an error if token is invalid
    const payload = jwt.verify(token, JWT_SECRET_KEY);

    // ensure the retrieved `sub` (i.e. User's ID) is an integer,
    // or throw an error otherwise
    assert(Number.isInteger(payload.sub), "User's ID in token not an integer");
    // ensure the retrieved `role` (i.e. User's role) is within the Role's
    // permitted values, or throw and error otherwise
    assert(Object.values(Role).includes(payload.role),
      "User's role in token not a permitted value");

    // if verified, add an extra property to the request object
    req.auth = {
      userId: payload.sub,
      userRole: payload.role
    };

    // route to the next middleware
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(401).send({
      error: "Missing or invalid credentials"
    });
  }
}
exports.requireAuth = requireAuth;

// Performs a validation via ONID's CAS to validate a User's credential.
// Returns a Promise that either
//   - Resolves to an object containing the logged in user's information, or
//   - Rejects with an error on failure, where error contains a code and the
//     error object.
function casValidateUser(casValidationUrl) {
  return new Promise((resolve, reject) => needle("get", casValidationUrl)
    .then(res => xml2js.parseStringPromise(res.body)
      .then(result => {
        const serviceResponse = result["cas:serviceResponse"];

        // resolve on successful authentication and reject otherwise
        if (serviceResponse &&
            Array.isArray(serviceResponse["cas:authenticationSuccess"]) &&
            serviceResponse["cas:authenticationSuccess"].length === 1 &&
            !serviceResponse["cas:authenticationFailure"]) {
          // resolve with the logged in User's information
          resolve(serviceResponse["cas:authenticationSuccess"][0]);
        } else {
          if (serviceResponse &&
              Array.isArray(serviceResponse["cas:authenticationFailure"]) &&
              serviceResponse["cas:authenticationFailure"].length > 0) {
            // when authentication fails due to invalid credential
            console.error("CAS authentication rejected\n");
            reject({
              code: 401,
              error: serviceResponse["cas:authenticationFailure"]  // array
            });
          } else {
            // fail-safe case, when failed to authenticate via CAS but CAS
            // doesn't return a proper failure object
            console.error("Unspecified error returned from CAS\n");
            reject({
              code: 500,
              error: null
            });
          }
        }
      })
      .catch(err => {
        // when parsing the response from CAS via XML2JS fails
        console.error("Error parsing CAS result\n");
        reject({
          code: 500,
          error: err
        });
      })
    )
    .catch(err => {
      // when sending request to CAS via Needle fails
      console.error("Error sending request to CAS\n");
      reject({
        code: 500,
        error: err
      });
    })
  );
}
exports.casValidateUser = casValidateUser;
