// File: course.js
// Description: handles routing for courses

require("path");
const express = require("express");
const app = express();

// user requests course data
app.get("/:courseCode", (req, res) => {

  const courseCode = req.params.courseCode;

  const text = `{
    "credits":4,
    "courseName":"Web Development",
    "courseCode":"CS290",
    "restriction":0,
    "description": "How to design and implement a multi-tier.",
    "Prerequisites": "CS 162 or 165."
  }`;

  const obj = JSON.parse(text);

  res.status(200).send(obj);

});

// everything else gets a 404 error
app.get("*", (req, res) => {
  res.status(404).send("Not found");
});

module.exports = app;
