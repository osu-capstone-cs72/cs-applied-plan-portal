// File: auth.js
// Description: Provides functions that handle the authentication process.

const jwt = require("jsonwebtoken");
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
