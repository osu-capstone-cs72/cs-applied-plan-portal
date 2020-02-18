// File: auth.js
// Description: Provides functions that handle the authentication process.

const needle = require("needle");
const jwt = require("jsonwebtoken");
const xml2js = require("xml2js");

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
// This function assumes the use of a Bearer token for the incoming request.
function requireAuth(req, res, next) {
  // get the `Authorization` request header if any, otherwise default to an
  // empty string
  const authHeader = req.get("Authorization") || "";
  // split the auth header to list by a space
  const authHeaderParts = authHeader.split(" ");
  // get the token if it's a Bearer, otherwise default to null
  const token = authHeaderParts[0] === "Bearer" ? authHeaderParts[1] : null;

  try {
    // use the jwt service to verify the token
    // this function call will throw if token is invalid
    const payload = jwt.verify(token, JWT_SECRET_KEY);

    // if verified, add extra properties to the request object
    req.auth = {
      userId: payload.sub,
      userRole: payload.role
    };

    // route to the next middleware
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(401).send({
      error: "Invalid credentials"
    });
  }
}
exports.requireAuth = requireAuth;

// Performs a validation via ONID's CAS to validate a User's credential.
// Returns a Promise that either
//   - Resolves to an object containing the logged in user's information on
//     success.
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
          // when authenticated to a single user
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
