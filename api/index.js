// File: index.js
// Description: handles all API routing

require("path");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

// parse request bodies as JSON
app.use(bodyParser.json());

app.use("/api/comment", require("./comment"));
app.use("/api/course", require("./course"));
app.use("/api/plan", require("./plan"));
app.use("/api/user", require("./user"));

// statically serve files from the public directory
app.use(express.static("src/public"));

// TEST EXAMPLE, REMOVE LATER
app.get("/api/getList", (req, res) => {
  const list = ["item1", "item2", "item3"];
  res.json(list);
  console.log("Sent list of items");
});

// everything else gets a 404 error
app.get("*", (req, res) => {
  console.log("Request:", req.url);
  console.log("File not found - 400\n");
  res.status(404).send("Not found");
});

module.exports = app;
