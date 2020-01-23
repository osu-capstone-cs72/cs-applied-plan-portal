// File: server.js
// Description: handles server functions and setup

console.log("Server JavaScript start");

// setup database connection and routing
require("dotenv").config();
const pool = require("./utils/mysqlPool").pool;
const app = require("./api/index");

// confirm that connection was made to the database
function testConnection(pool, callback) {
  pool.query("SELECT courseId FROM Course WHERE courseId = 1", (err) => {
    if (err) {
      throw err;
    } else {
      console.log("Connected to database");
      callback();
    }
  });
}

// listen for incoming requests
const port = process.env.PORT || 3000;
testConnection(pool, () => {
  app.listen(port, () => {
    console.log("Server is listening on port", port, "\n");
  });
});
