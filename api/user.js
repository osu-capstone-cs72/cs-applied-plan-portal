// File: user.js
// Description: Handles API routing for Users.

require("path");
const express = require("express");
const url = require("url");
const validator = require("validator");

const { ENV } = require("../entities/environment");
const { Role } = require("../entities/role");
const userModel = require("../models/user");
const {
  userSchema,
  getSchemaViolations,
  sanitizeUsingSchema,
  searchUserSchema
} = require("../services/validation/schemaValidation");
const {
  casValidateUser,
  generateAuthToken,
  requireAuth,
  setAuthCookie
} = require("../services/auth/auth");

const app = express();

// Fetches a list of Users based on the search query.
app.get("/search/:text/:role/:cursorPrimary/:cursorSecondary", requireAuth, async (req, res) => {
  try {

    // use schema validation to ensure valid request params
    const errorMessage = getSchemaViolations(req.params, searchUserSchema);

    if (!errorMessage) {

      const sanitizedBody = sanitizeUsingSchema(req.params, searchUserSchema);

      const text = sanitizedBody.text;
      const role = sanitizedBody.role;
      const cursor = {
        primary: sanitizedBody.cursorPrimary,
        secondary: sanitizedBody.cursorSecondary
      };

      console.log("Searching for users");

      // fetch the authenticated user's info
      const authenticatedUser = await userModel.getUserById(req.auth.userId);

      // only allow an Advisor or a Head Advisor to fetch Users
      if (authenticatedUser.role === Role.advisor ||
        authenticatedUser.role === Role.headAdvisor) {
        const matchingUsers = await userModel.searchUsers(text, parseInt(role, 10), cursor);

        if (matchingUsers.users.length) {
          console.log("200: Matching Users found \n");
          res.status(200).send(matchingUsers);
        } else {
          console.error("404: No matching Users found\n");
          res.status(404).send({ error: "No matching users found." });
        }
      } else {
        console.error(`403: User ${authenticatedUser.userId} not authorized to perform this action\n`);
        res.status(403).send({
          error: "Only advisors and head advisors can fetch users"
        });
      }

    } else {
      // send an error explaining the schema violation
      console.error("400:", errorMessage, "\n");
      res.status(400).send({ error: errorMessage });
      return;
    }

  } catch (err) {
    console.error("500: An internal server error occurred\n Error:", err);
    res.status(500).send({
      error: "An internal server error occurred. Please try again later."
    });
  }
});


// Creates a new User in the system.
app.post("/", requireAuth, async (req, res) => {
  try {
    // fetch the authenticated user's info
    const authenticatedUser = await userModel.getUserById(req.auth.userId);

    // only allow a Head Advisor to create new Users
    if (authenticatedUser && authenticatedUser.role === Role.headAdvisor) {
      // validate the request body against the schema and get error message,
      // if any
      const schemaViolations = getSchemaViolations(req.body, userSchema);
      if (!schemaViolations) {
        // sanitize the request body and pass it to the model
        const newUser = sanitizeUsingSchema(req.body, userSchema);
        const result = await userModel.createUser(newUser);

        console.log("201: User created\n");
        res.status(201).send({ userId: result.insertId });
      } else {
        console.error(schemaViolations);
        res.status(400).send({ error: schemaViolations });
      }
    } else {
      console.error(`403: User ${authenticatedUser.userId} not authorized to perform this action\n`);
      res.status(403).send({
        error: "Only head advisors can create new users"
      });
    }
  } catch (err) {
    console.error("500: An internal server error occurred\n Error:", err);
    res.status(500).send({
      error: "An internal server error occurred. Please try again later."
    });
  }
});

// check if a user is already authenticated
app.get("/authenticated", requireAuth, (req, res) => {
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
    protocol: (process.env.NODE_ENV === ENV.PRODUCTION) ? "https" : "http",
    host: req.get("host"),
    pathname: url.parse(req.originalUrl).pathname,  // this route
    query: {
      target: targetUrl
    }
  });

  // send the ticket to this URL to validate it against CAS
  const hostname = (process.env.NODE_ENV === ENV.PRODUCTION)
    ? "login.oregonstate.edu"
    : "login-int.iam.oregonstate.edu"
  const casValidationUrl = url.format({
    protocol: "https",
    hostname: hostname,
    pathname: `/idp/profile/cas/serviceValidate`,
    query: {
      ticket: ticket,
      service: callbackUrl
    }
  });

  console.log(`Validating the user via ${casValidationUrl}\n`);

  try {
    // validate the user via ONID's CAS and get back object containing
    // information about the user
    const casUser = await casValidateUser(casValidationUrl);
    const userAttributes = casUser["cas:attributes"][0];

    // make this nested try to catch potential error when parsing
    try {
      // try fetching the User from the database by ID
      const osuuid = validator.toInt(userAttributes["cas:osuuid"][0] + "");
      const existingUser = await userModel.getUserById(osuuid);

      // if the User is not already in the database, create one for them
      if (!existingUser) {
        // construct a new User object and force student role on create
        // changes in roles must be approved by the administrator(s)
        const newUser = {
          userId: osuuid,
          firstName: userAttributes["cas:givenName"][0],
          lastName: userAttributes["cas:lastname"][0],
          email: userAttributes["cas:osuprimarymail"][0],
          role: Role.student
        };

        // insert the new User to the database
        await userModel.createUser(newUser);
        console.log(`201: User created: ${newUser.userId} (${newUser.email})\n`);
      }

      // fetch this User from the database again to ensure getting correct info
      const user = await userModel.getUserById(osuuid);  // guaranteed to have 1

      // sign this User with a JWT
      const token = generateAuthToken(user.userId);

      console.log(`200: User authenticated: ${user.userId} (${user.email})`);
      console.log(`Redirecting to ${targetUrl}\n`);

      // redirect to the target URL and set an auth cookie
      setAuthCookie(res, token, user.userId, user.role);

      res.status(200).redirect(targetUrl);
    } catch (err) {
      console.error("Error fetching or inserting User:", err);
      res.status(500).send({ error: err });
    }
  } catch (err) {
    console.error(`${err.code}:`, err.error);
    res.status(err.code).send({ error: err.error });
  }
});


// Fetches a list of plans related to a specific User.
app.get("/:userId/plans", requireAuth, async (req, res) => {
  try {
    // attempt to convert the target user's ID in route to an integer
    // return NaN if it's not an integer
    const userId = validator.toInt(req.params.userId + "");

    // ensure the provided target user's ID satisfies the schema
    if (Number.isInteger(userId) &&
      userSchema.userId.minValue <= userId &&
      userId <= userSchema.userId.maxValue) {
      // fetch the authenticated user's info
      const authenticatedUser = await userModel.getUserById(req.auth.userId);

      // only allow the authenticated user with the same ID as the target user,
      // an Advisor, and a Head Advisor to perform this action
      if (authenticatedUser &&
        (authenticatedUser.userId === userId ||
          authenticatedUser.role === Role.advisor ||
          authenticatedUser.role === Role.headAdvisor)) {
        // fetch the target user's plans
        const results = await userModel.getUserPlans(userId);

        if (results.plans.length > 0) {
          console.log("200: Plans found\n");
          res.status(200).send(results);
        } else {
          console.error("404: No plans found\n");
          res.status(404).send({ error: "No plans found" });
        }
      } else {
        console.error(`403: User ${authenticatedUser.userId} not authorized to perform this action\n`);
        res.status(403).send({
          error: "Only the target user, advisors, and head advisors can fetch the target user's plans"
        });
      }
    } else {
      console.error(`400: ${userSchema.userId.getErrorMessage()}\n`);
      res.status(400).send({ error: userSchema.userId.getErrorMessage() });
    }
  } catch (err) {
    console.error("500: An internal server error occurred\n Error:", err);
    res.status(500).send({
      error: "An internal server error occurred. Please try again later."
    });
  }
});


// Fetches information about a specific User.
app.get("/:userId", requireAuth, async (req, res) => {
  try {
    // attempt to convert the target user's ID in route to an integer
    // return NaN if it's not an integer
    const userId = validator.toInt(req.params.userId + "");

    // ensure the provided target user's ID satisfies the schema
    if (Number.isInteger(userId) &&
      userSchema.userId.minValue <= userId &&
      userId <= userSchema.userId.maxValue) {
      // fetch the authenticated user's info
      const authenticatedUser = await userModel.getUserById(req.auth.userId);

      // only allow the authenticated user with the same ID as the target user,
      // an Advisor, and a Head Advisor to perform this action
      if (authenticatedUser &&
        (authenticatedUser.userId === userId ||
          authenticatedUser.role === Role.advisor ||
          authenticatedUser.role === Role.headAdvisor)) {
        // fetch the target user's info
        const user = await userModel.getUserById(userId);

        if (user) {
          console.log("200: User found\n");
          res.status(200).send(user);
        } else {
          console.error("404: No User found\n");
          res.status(404).send({ error: "No User found" });
        }
      } else {
        console.error(`403: User ${authenticatedUser.userId} not authorized to perform this action\n`);
        res.status(403).send({
          error: "Only the target user, advisors, and head advisors can fetch the target user's info"
        });
      }
    } else {
      console.error(`400: ${userSchema.userId.getErrorMessage()}\n`);
      res.status(400).send({ error: userSchema.userId.getErrorMessage() });
    }
  } catch (err) {
    console.error("500: An internal server error occurred\n Error:", err);
    res.status(500).send({
      error: "An internal server error occurred. Please try again later."
    });
  }
});


// Partially updates the User with the provided ID.
app.patch("/:userId", requireAuth, async (req, res) => {
  try {
    // attempt to convert the target user's ID in route to an integer
    // return NaN if it's not an integer
    const userId = validator.toInt(req.params.userId + "");

    // ensure the provided target user's ID satisfies the schema
    if (Number.isInteger(userId) &&
      userSchema.userId.minValue <= userId &&
      userId <= userSchema.userId.maxValue) {
      // fetch the authenticated user's info
      const authenticatedUser = await userModel.getUserById(req.auth.userId);

      // only allow a Head Advisor to update a User's info
      if (authenticatedUser && authenticatedUser.role === Role.headAdvisor) {
        // validate the request body against the schema and get error message,
        // if any
        const schemaViolations = getSchemaViolations(req.body, userSchema, true);
        if (!schemaViolations) {
          // sanitize the request body and pass it to the model
          const updatedUser = sanitizeUsingSchema(req.body, userSchema);
          const result = await userModel.updateUserPartial(userId, updatedUser);

          console.log("200: User partial update succeeded\n");
          res.status(200).send({ changedRows: result.changedRows });
        } else {
          console.error(schemaViolations);
          res.status(400).send({ error: schemaViolations });
        }
      } else {
        console.error(`403: User ${authenticatedUser.userId} not authorized to perform this action\n`);
        res.status(403).send({
          error: "Only head advisors can update a user's information"
        });
      }
    } else {
      console.error(`400: ${userSchema.userId.getErrorMessage()}\n`);
      res.status(400).send({ error: userSchema.userId.getErrorMessage() });
    }
  } catch (err) {
    console.error("500: An internal server error occurred\n Error:", err);
    res.status(500).send({
      error: "An internal server error occurred. Please try again later."
    });
  }
});

module.exports = app;
