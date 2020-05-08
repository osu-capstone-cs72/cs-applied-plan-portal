// File: index.js
// Description: handles all API routing

const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();

app.set("env", process.env.ENV);

// catch invalid JSON request bodies
app.use((req, res, next) => {
  bodyParser.json()(req, res, err => {
    if (err) {
      console.error("400: Invalid JSON request body");
      res.status(400).send({error: "400: Invalid JSON request body"});
    } else {
      next();
    }
  });
});

app.use(cors());

// log incoming requests
app.all("/api/*", (req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

// handle requests
app.use("/api/notification", require("./notification"));
app.use("/api/review", require("./review"));
app.use("/api/comment", require("./comment"));
app.use("/api/course", require("./course"));
app.use("/api/plan", require("./plan"));
app.use("/api/user", require("./user"));

// a simple route to test API server's response
app.get("/api/test", (req, res) => {
  console.log("200: API server running\n");
  res.status(200).send({message: "API server running"});
});

app.get("/api/testdb", async (req, res) => {
  const sql = "SELECT * FROM User WHERE userId = ?";
  const {pool} = require("../services/db/mysqlPool");
  const results = await pool.query(sql, 72727272727);

  res.status(200).send(results[0][0]);
});

// statically serve files from the React app if in production mode
if (process.env.ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
} else {
  // if on other modes, everything else gets a 404 error
  app.get("/api/*", (req, res) => {
    console.error("404: File not found\n");
    res.status(404).send({error: "Not Found"});
  });
}

module.exports = app;
