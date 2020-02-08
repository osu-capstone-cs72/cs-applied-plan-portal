// File: course.js
// Description: handles routing for courses

require("path");
const express = require("express");
const app = express();
const getCourse = require("../models/course").getCourse;

// search for course data
app.get("/:mode/:searchText", async (req, res) => {

  console.log("Search for course data");
  const searchText = req.params.searchText;
  const mode = req.params.mode;

  try {

    const results = await getCourse(searchText, mode);
    if (results.length === 0) {
      console.error("404: No courses found\n");
      res.status(404).send("No courses found.");
    } else {
      console.log("200: Courses found\n");
      res.status(200).send(results);
    }

  } catch (err) {
    console.error("500: An internal server error occurred\n Error:", err);
    res.status(500).send({error: "An internal server error occurred. Please try again later."});
  }

});

module.exports = app;
