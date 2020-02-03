// File: index.js
// Description: handles all API routing

require("path");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

// parse request bodies as JSON
app.use(bodyParser.json());

// log incoming requests (Later replace with proper module)
app.get("*", (req, res, next) => {
  console.log("Request:", req.url);
  next();
});

app.use("/api/comment", require("./comment"));
app.use("/api/course", require("./course"));
app.use("/api/plan", require("./plan"));
app.use("/api/user", require("./user"));

// statically serve files from the public directory
app.use(express.static("src/public"));

// everything else gets a 404 error
app.get("*", (req, res) => {
  console.log("File not found - 400\n");
  res.status(404).send("Not found");
});

module.exports = app;
