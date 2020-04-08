// File: auth.js
// Description: Provides functions that handle the authentication process.

const assert = require("assert");
const jwt = require("jsonwebtoken");
const needle = require("needle");
const validator = require("validator");
const xml2js = require("xml2js");
const {serialize} = require("cookie");

const {userSchema} = require("../validation/schemaValidation");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// Generates an auth token for a specific User with the provided ID.
// Token is a JSON Web Token which expires in 24 hours.
function generateAuthToken(userId) {
  const payload = {
    sub: userId
  };
  const token = jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: "24h"});
  return token;
}
exports.generateAuthToken = generateAuthToken;

// This middleware function routes to the next middleware if and only if the
// provided credential is valid. Otherwise, respond with the 401 error and an
// error message.
//
// Put this function before the middleware handler of any API route that
// requires authorization.
//
// Notes:
// - No need to null-check `req` and `req.auth` because they are null-safe.
// - No need to check the type and value range of `userId` because the
//   assertions in this function already does that job.
function requireAuth(req, res, next) {
  // first of all, clear the field that will be used for holding the payload
  req.auth = {};

  try {
    // ensure that the cookie has the JWT field
    assert(req.query.accessToken, "No access token in request");

    // use the jwt service to verify the token
    // this function call throws an error if token is invalid
    const payload = jwt.verify(req.query.accessToken, JWT_SECRET_KEY);

    // ensure the retrieved `sub` (i.e. User's ID) satisfies the schema or
    // throw a schema validation error otherwise
    assert(
      validator.isInt(payload.sub + "", {
        min: userSchema.userId.minValue,
        max: userSchema.userId.maxValue
      }),
      userSchema.userId.getErrorMessage()
    );

    // if verified, add an extra property to the request object
    req.auth = {
      userId: payload.sub
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

// sets an authentication cookie
// Source: "Authenticating Users" by Rob Hess,
// https://docs.google.com/document/d/17zERsoO6i5MMQjVfDsb_OKo2MopVV4Jn8Q8qbo8bFFI
const setAuthCookie = (res, token) => {
  res.setHeader("Set-Cookie", [
    serialize("auth", token, {
      path: "/",
      httpOnly: true,
      sameSite: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 8)
    }),
    serialize("csrf", token, {
      path: "/",
      sameSite: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 8)
    })
  ]);
};
exports.setAuthCookie = setAuthCookie;
