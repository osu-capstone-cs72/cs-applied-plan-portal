// File: course.js
// Description: handles routing for courses

require("path");
const express = require("express");
const app = express();
const getCourse = require("../models/course").getCourse;

// user requests course data
app.get("/:mode/:searchText", (req, res) => {

  console.log("User searching for courses");
  const searchText = req.params.searchText;
  const mode = req.params.mode;

  getCourse(searchText, mode)
    .then((results) => {
      if (results.length === 0) {
        console.log("No courses found - 404\n");
        res.status(404).send("No courses found.");
      } else {
        console.log("Courses found - 200\n");
        res.status(200).send(results);
      }
    })
    .catch((err) => {
      console.log("An internal server error occurred - 500\n Error:", err);
      res.status(500).send("An internal server error occurred. Please try again later.");
    });

});

module.exports = app;
