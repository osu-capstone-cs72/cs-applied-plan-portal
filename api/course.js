// File: course.js
// Description: handles routing for courses

require("path");
const express = require("express");
const app = express();
const {getCourse, getLiveCourses} = require("../models/course");
const {getUserById} = require("../models/user");
const {Role} = require("../entities/role");
const {requireAuth} = require("../services/auth/auth");

// search for course data
app.get("/:mode/:searchText", requireAuth, async (req, res) => {

  console.log("Search for course data");
  const searchText = req.params.searchText;
  const mode = req.params.mode;

  try {

    const results = await getCourse(searchText, mode);
    if (results.courses.length === 0) {
      console.error("404: No courses found\n");
      res.status(404).send({error: "No courses found."});
    } else {
      console.log("200: Courses found\n");
      res.status(200).send(results);
    }

  } catch (err) {
    console.error("500: An internal server error occurred\n Error:", err);
    res.status(500).send({error: "An internal server error occurred. Please try again later."});
  }

});

// get all live course data from the Course API server
app.get("/live", requireAuth, async (req, res) => {

  try {

    console.log("Get all courses from the OSU course API");

    // get user data
    const authenticatedUser = await getUserById(req.auth.userId);

    // due to the computational cost of this action,
    // only the head advisor can perform this action
    // only allow an Advisor or a Head Advisor to fetch Users
    if (authenticatedUser.role === Role.advisor ||
        authenticatedUser.role === Role.headAdvisor) {

      const results = await getLiveCourses();
      if (results.courses.length === 0) {
        console.error("404: No courses found\n");
        res.status(404).send({error: "No courses found."});
      } else {
        console.log("200: Courses found\n");
        res.status(200).send(results);
      }
    } else {
      console.error(`403: User ${authenticatedUser.userId} not authorized to perform this action\n`);
      res.status(403).send({
        error: "Only head advisors can get courses from the OSU course API"
      });
    }

  } catch (err) {
    console.error("500: An internal server error occurred\n Error:", err);
    res.status(500).send({error: "An internal server error occurred. Please try again later."});
  }

});

module.exports = app;
