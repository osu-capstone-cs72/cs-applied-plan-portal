// File: index.js
// Description: handles all API routing

require("path");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());

// log incoming requests (Later replace with proper module)
app.get("*", (req, res, next) => {
  console.log("Request:", req.url);
  next();
});

app.use("/review", require("./review"));
app.use("/comment", require("./comment"));
app.use("/course", require("./course"));
app.use("/plan", require("./plan"));
app.use("/user", require("./user"));

// statically serve files from the public directory
app.use(express.static("src/public"));

// everything else gets a 404 error
app.get("*", (req, res) => {
  console.error("404: File not found\n");
  res.status(404).send({error: "Not Found"});
});

module.exports = app;
