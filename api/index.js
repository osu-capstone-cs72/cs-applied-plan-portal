// File: index.js
// Description: handles all API routing

require("path");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

// parse request bodies as JSON
app.use(bodyParser.json());

// app.use('/comments', require('./comment'));
// app.use('/courses', require('./course'));
app.use("/plans", require("./plan"));
// app.use('/users', require('./user'));

// statically serve files from the public directory
app.use(express.static("views/public"));

// everything else gets a 404 error
app.get("*", (req, res) => {
  res.status(404).send("Not found");
});

module.exports = app;
