// File: comment.js
// Description: handles routing for comments

require("path");
const express = require("express");
const app = express();

const getComment = require("../models/comment").getComment;

// get a comment by id
app.get("/:commentId", (req, res) => {

  const commentId = req.params.commentId;
  console.log("Viewing comment", commentId);

  getComment(commentId)
    .then((results) => {
      if (results.length === 0) {
        console.log("No comment found - 404\n");
        res.status(404).send("No comment found.");
      } else {
        console.log("Comment found - 200\n");
        res.status(200).send(results);
      }
    })
    .catch((err) => {
      console.log("An internal server error occurred - 500\n Error:", err);
      res.status(500).send("An internal server error occurred. Please try again later.");
    });

});

module.exports = app;
