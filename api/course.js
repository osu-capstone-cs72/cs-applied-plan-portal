// File: course.js
// Description: handles routing for courses

require("path");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

// parse request bodies as JSON
app.use(bodyParser.json());

// user requests a course
app.get("/", (req, res) => {

  const text = `{
    "credits":4,
    "courseName":"Web Development",
    "courseCode":"CS290",
    "restriction":0
    }`;

  const obj = JSON.parse(text);

  res.status(200).send(obj);

});

// everything else gets a 404 error
app.get("*", (req, res) => {
  res.status(404).send("Not found");
});

module.exports = app;
