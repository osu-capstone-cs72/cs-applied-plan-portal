// File: user.js
// Description: Handles API routing for Users.

require("path");
const express = require("express");
const url = require("url");
const validator = require("validator");

const {Role} = require("../utils/role");
const userModel = require("../models/user");
const {
  userSchema,
  getSchemaViolations,
  sanitizeUsingSchema
} = require("../utils/schemaValidation");
const {
  casValidateUser,
  generateAuthToken,
  getTokenExpirationTime
} = require("../utils/auth");

const app = express();

// Creates a new User in the system.
app.post("/", async (req, res) => {
  // validate the request body against the schema and get error message, if any
  const schemaViolations = getSchemaViolations(req.body, userSchema);
  if (!schemaViolations) {
    // if there were no schema violations, continue to proceed
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
});

// Retrieves the CAS ticket after a User has successfully logged in via ONID.
app.get("/login", async (req, res) => {
  const callbackUrl = `${req.protocol}://` +   // protocol
    `${req.get("host")}` +                     // host:port
    `${url.parse(req.originalUrl).pathname}`;  // /request/path/no/query

  const casValidationUrl = `https://login.oregonstate.edu/idp-dev/profile/cas` +
    `/serviceValidate?ticket=${req.query.ticket}&service=${callbackUrl}`;

  try {
    // validate the user via ONID's CAS and get back object containing
    // information about the user
    const casUser = await casValidateUser(casValidationUrl);
    const userAttr = casUser["cas:attributes"][0];

    // try fetching the User from the database by ID
    try {

      let osuuid = validator.toInt(userAttr["cas:osuuid"][0]);
      const results = await userModel.getUserById(osuuid);

      // if the User is not already in the database, create one for them
      if (results.length === 0) {
        // construct a new User object
        const newUser = {
          userId: osuuid,
          firstName: userAttr["cas:givenName"][0],
          lastName: userAttr["cas:lastname"][0],
          email: userAttr["cas:osuprimarymail"][0],
          role: Role[userAttr["cas:eduPersonPrimaryAffiliation"][0]]
        };

        // insert the new User to the database, change `osuuid` if has to
        osuuid = (await userModel.createUser(newUser)).insertId;
      }

      // fetch this User from the database to ensure getting correct info
      const user = (await userModel.getUserById(osuuid))[0];
      // sign this User with a JWT
      const token = generateAuthToken(user.userId, user.role);

      console.log(`200: User ${osuuid} (${user.lastName}, ${user.firstName}) authenticated\n`);
      // set token in a cookie in the Bearer format and then redirect to root
      res.status(200)
        .cookie("accessToken", `Bearer ${token}`, {
          expires: getTokenExpirationTime(token),  // expiration time
          httpOnly: true,  // accessible via web server only
          signed: true     // this cookie shall be signed

          // TODO: Enable this option in production
          // secure: true     // allow https only
        })
        .redirect("/");
    } catch (err) {
      console.error("Error fetching or inserting User:", err);
      res.status(500).send({error: err});
    }
  } catch (err) {
    console.error(`${err.code}:`, err.error);
    res.status(err.code).send({error: err.error});
  }
});

// Logs a User in.
app.post("/login", async (req, res) => {
  // ensure the provided request body is valid
  if (req.body.email && validator.isLength(req.body.email + "", {min: 1})) {
    try {
      const authenticated = await userModel.authenticateUser(req.body.email);

      if (authenticated) {
        const user = await userModel.getUserByEmail(req.body.email);
        const token = generateAuthToken(user.userId, user.role);

        console.log("200: User authenticated\n");
        res.status(200).send({
          token: token
        });
      } else {
        console.error("401: Invalid credential\n");
        res.status(401).send({
          error: "Invalid credential"
        });
      }
    } catch (err) {
      console.error("500: Error authenticating User:", err);
      res.status(500).send({
        error: "Unable to authenticate User. Please try again later."
      });
    }
  } else {
    console.error("400: Invalid request body\n");
    res.status(400).send({error: "Invalid request body"});
  }
});

// Fetches a list of plans related to a specific User.
app.get("/:userId/plans", async (req, res) => {
  // ensure the provided request parameter is a valid integer
  if (validator.isInt(req.params.userId + "")) {
    try {
      // sanitize the request parameter and pass it to the model
      const userId = validator.toInt(req.params.userId);
      const results = await userModel.getUserPlans(userId);

      if (Array.isArray(results) && results.length > 0) {
        console.log("200: Plans found\n");
        res.status(200).send(results);
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
    console.error("400: Invalid User ID\n");
    res.status(400).send({error: "Invalid User ID"});
  }
});

// Fetches information about a specific User.
app.get("/:userId", async (req, res) => {
  // ensure the provided request parameter is a valid integer
  if (validator.isInt(req.params.userId + "")) {
    try {
      // sanitize the request parameter and pass it to the model
      const userId = validator.toInt(req.params.userId);
      const results = await userModel.getUserById(userId);

      if (Array.isArray(results) && results.length > 0) {
        console.log("200: User found\n");
        res.status(200).send(results[0]);
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
    console.error("400: Invalid User Id\n");
    res.status(400).send({error: "Invalid User Id"});
  }
});

module.exports = app;
