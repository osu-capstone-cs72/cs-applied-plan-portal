// File: comment.js
// Description: handles routing for comments

require("path");
const express = require("express");
const app = express();

const getComment = require("../models/comment").getComment;
const createComment = require("../models/comment").createComment;

// get comment by id
app.get("/:commentId", async (req, res) => {

  const commentId = req.params.commentId;
  console.log("Get comment", commentId);

  try {

    const results = await getComment(commentId);
    if (results.length === 0) {
      console.log("No comment found - 404\n");
      res.status(404).send("No comment found.");
    } else {
      console.log("Comment found - 200\n");
      res.status(200).send(results);
    }

  } catch (err) {
    console.log("An internal server error occurred - 500\n Error:", err);
    res.status(500).send("An internal server error occurred. Please try again later.");
  }

});

// create a new comment
app.post("/:planId/:userId/:text", async (req, res) => {

  const planId = req.params.planId;
  const userId = req.params.userId;
  const text = req.params.text;
  console.log("User ", userId, "creating a comment on plan", planId);

  try {

    await createComment(planId, userId, text);
    console.log("Comment created - 201\n");
    res.status(201).send("Comment created");

  } catch (err) {
    console.log("An internal server error occurred - 500\n Error:", err);
    res.status(500).send("An internal server error occurred. Please try again later.");
  }

});

module.exports = app;
