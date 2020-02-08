// File: comment.js
// Description: handles routing for comments

require("path");
const express = require("express");
const app = express();

const enforceConstraints = require("../utils/commentValidation").enforceConstraints;
const getComment = require("../models/comment").getComment;
const createComment = require("../models/comment").createComment;
const {
  commentSchema,
  getSchemaViolations,
  sanitizeUsingSchema
} = require("../utils/schemaValidation");

// create a new comment
app.post("/", async (req, res) => {

  try {

    // use schema validation to ensure valid request body
    const errorMessage = getSchemaViolations(req.body, commentSchema);

    if (!errorMessage) {

      const sanitizedBody = sanitizeUsingSchema(req.body, commentSchema);

      // get request body
      const planId = sanitizedBody.planId;
      const userId = sanitizedBody.userId;
      const text = sanitizedBody.text;
      console.log("User ", userId, "creating a comment on plan", planId);

      // only save a comment if it does not violate any constraints
      const violation = await enforceConstraints(planId, userId);
      if (violation === "valid") {

        const results = await createComment(planId, userId, text);
        console.log("201: Comment created\n");
        res.status(201).send(results);

      } else {

        // send an error that explains the violated constraint
        console.error("400:", violation, "\n");
        res.status(400).send({error: violation});

      }

    } else {
      console.error("400:", errorMessage, "\n");
      res.status(400).send({error: errorMessage});
      return;
    }

  } catch (err) {
    console.error("500: An internal server error occurred\n Error:", err);
    res.status(500).send({error: "An internal server error occurred. Please try again later."});
  }

});

// get comment by id
app.get("/:commentId", async (req, res) => {

  const commentId = req.params.commentId;
  console.log("Get comment", commentId);

  try {

    const results = await getComment(commentId);
    if (results.length === 0) {
      console.error("404: No comment found\n");
      res.status(404).send({error: "No comment found."});
    } else {
      console.log("200: Comment found\n");
      res.status(200).send(results);
    }

  } catch (err) {
    console.error("500: An internal server error occurred\n Error:", err);
    res.status(500).send({error: "An internal server error occurred. Please try again later."});
  }

});

module.exports = app;
