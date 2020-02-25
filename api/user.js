// File: user.js
// Description: Handles API routing for Users.

require("path");
const express = require("express");
const url = require("url");
const validator = require("validator");

const {Role} = require("../entities/role");
const userModel = require("../models/user");
const {
  userSchema,
  getSchemaViolations,
  sanitizeUsingSchema
} = require("../services/validation/schemaValidation");
const {
  casValidateUser,
  generateAuthToken,
  requireAuth
} = require("../services/auth/auth");

const app = express();

// Creates a new User in the system.
app.post("/", requireAuth, async (req, res) => {
  // limit auth payload's info to this function's scope
  const auth = req.auth;
  req.auth = {};

  // only permit HeadAdvisor (aka Admin) to create new Users
  if (auth.userRole === Role.headAdvisor) {
    // validate the request body against the schema and get error message,
    // if any
    const schemaViolations = getSchemaViolations(req.body, userSchema);
    if (!schemaViolations) {
      try {
        // sanitize the request body and pass it to the model
        const newUser = sanitizeUsingSchema(req.body, userSchema);
        const result = await userModel.createUser(newUser);

        console.log("201: User created\n");
        res.status(201).send({userId: result.insertId});
      } catch (err) {
        console.error("500: Error creating new User:", err);
        res.status(500).send({
          error: "Error creating new User. Please try again later."
        });
      }
    } else {
      console.error(schemaViolations);
      res.status(400).send({error: schemaViolations});
    }
  } else {
    console.error(`403: User ${auth.userId} not authorized to perform this action\n`);
    res.status(403).send({error: "Forbidden"});
  }
});

// check if a user is already authenticated
app.get("/authenticated", requireAuth, (req, res)  => {
  console.log("200: Test auth with React server - authenticated\n");
  res.status(200).send({
    message: "authenticated"
  });
});

// Retrieves the CAS ticket after a User has successfully logged in via ONID.
// Sends the second request to CAS with the ticket to validate it.
app.get("/login", async (req, res) => {
  // the ticket retrieved from CAS after successful login
  const ticket = req.query.ticket;

  // the final URL to redirect to on successful login, used as a query of the
  // callback URL
  const targetUrl = req.query.target;

  // the callback URL, used as a query of the URL of the second request sent to
  // CAS to validate the ticket received from the first request
  const callbackUrl = url.format({
    protocol: req.protocol,
    host: req.get("host"),
    pathname: url.parse(req.originalUrl).pathname,  // this route
    query: {
      target: targetUrl
    }
  });

  // send the ticket to this URL to validate the it against CAS
  const casValidationUrl = url.format({
    protocol: "https",
    hostname: "login.oregonstate.edu",
    pathname: "/idp-dev/profile/cas/serviceValidate",
    query: {
      ticket: ticket,
      service: callbackUrl
    }
  });

  try {
    // validate the user via ONID's CAS and get back object containing
    // information about the user
    const casUser = await casValidateUser(casValidationUrl);
    const userAttributes = casUser["cas:attributes"][0];

    // make this nested try to catch potential error when parsing
    try {
      // try fetching the User from the database by ID
      const osuuid = validator.toInt(userAttributes["cas:osuuid"][0]);
      const existingUser = await userModel.getUserById(osuuid);

      // if the User is not already in the database, create one for them
      if (!existingUser) {
        // construct a new User object
        const newUser = {
          userId: osuuid,
          firstName: userAttributes["cas:givenName"][0],
          lastName: userAttributes["cas:lastname"][0],
          email: userAttributes["cas:osuprimarymail"][0],
          role: Role[userAttributes["cas:eduPersonPrimaryAffiliation"][0]]
        };

        // insert the new User to the database
        await userModel.createUser(newUser);
        console.log(`201: User created: ${newUser.userId} (${newUser.email})\n`);
      }

      // fetch this User from the database again to ensure getting correct info
      const user = await userModel.getUserById(osuuid);  // guaranteed to have 1

      // sign this User with a JWT
      const token = generateAuthToken(user.userId, user.role);

      // include this token in the redirect URL
      const parsedTargetUrl = url.parse(targetUrl, true);
      parsedTargetUrl.query.accessToken = token;

      // finalize the redirect URL
      const targetUrlWithToken = url.format(parsedTargetUrl);

      console.log(`200: User authenticated: ${user.userId} (${user.email})`);
      console.log(`Redirecting to ${targetUrlWithToken}\n`);
      // redirect to the target URL with the token
      res.status(200).redirect(targetUrlWithToken);
    } catch (err) {
      console.error("Error fetching or inserting User:", err);
      res.status(500).send({error: err});
    }
  } catch (err) {
    console.error(`${err.code}:`, err.error);
    res.status(err.code).send({error: err.error});
  }
});

// Fetches a list of plans related to a specific User.
app.get("/:userId/plans", requireAuth, async (req, res) => {
  // limit auth payload's info to this function's scope
  const auth = req.auth;
  req.auth = {};

  // attempt to convert `userId` param in route to an integer
  // return NaN if it's not an integer
  const userId = validator.toInt(req.params.userId + "");

  // ensure the provided request parameter is a valid integer
  if (Number.isInteger(userId)) {
    // only permit the User with this ID or an Advisor or a Head Advisor
    if (auth.userId === userId ||
        auth.userRole === Role.advisor ||
        auth.userRole === Role.headAdvisor) {
      try {
        const plans = await userModel.getUserPlans(userId);

        if (plans.length > 0) {
          console.log("200: Plans found\n");
          res.status(200).send(plans);
        } else {
          console.error("404: No plans found\n");
          res.status(404).send({error: "No plans found"});
        }
      } catch (err) {
        console.error("500: Error fetching Plans:", err);
        res.status(500).send({
          error: "Unable to fetch Plans. Please try again later."
        });
      }
    } else {
      console.error(`403: User ${auth.userId} not authorized to perform this action\n`);
      res.status(403).send({error: "Forbidden"});
    }
  } else {
    console.error("400: Invalid User ID\n");
    res.status(400).send({error: "Invalid User ID"});
  }
});

// Fetches information about a specific User.
app.get("/:userId", requireAuth, async (req, res) => {
  // limit auth payload's info to this function's scope
  const auth = req.auth;
  req.auth = {};

  // attempt to convert `userId` param in route to an integer
  // return NaN if it's not an integer
  const userId = validator.toInt(req.params.userId + "");

  // ensure the provided request parameter is a valid integer
  if (Number.isInteger(userId)) {
    // only permit the User with this ID or an Advisor or a Head Advisor
    if (auth.userId === userId ||
        auth.userRole === Role.advisor ||
        auth.userRole === Role.headAdvisor) {
      try {
        const user = await userModel.getUserById(userId);

        if (user) {
          console.log("200: User found\n");
          res.status(200).send(user);
        } else {
          console.error("404: No User found\n");
          res.status(404).send({error: "No User found"});
        }
      } catch (err) {
        console.error("500: Error fetching User:", err);
        res.status(500).send({
          error: "Unable to fetch User. Please try again later."
        });
      }
    } else {
      console.error(`403: User ${auth.userId} not authorized to perform this action\n`);
      res.status(403).send({
        error: "Forbidden"
      });
    }
  } else {
    console.error("400: Invalid User Id\n");
    res.status(400).send({error: "Invalid User Id"});
  }
});

module.exports = app;
