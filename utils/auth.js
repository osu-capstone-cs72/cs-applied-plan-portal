// File: auth.js
// Description: Provides functions that handle the authentication process.

// This middleware function routes to the next middleware if and only if the
// provided credential is valid. Otherwise, respond with the 401 error and an
// error message.
//
// Put this function before the middleware handler of any API route that
// requires authorization.
function requireAuth(req, res, next) {
  try {
    next();  // TODO: placeholder for now
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(401).send({
      error: "Invalid credentials"
    });
  }
}
exports.requireAuth = requireAuth;
