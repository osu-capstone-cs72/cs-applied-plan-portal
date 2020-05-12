// File: server.js
// Description: handles server functions and setup

console.log("Server JavaScript start");

const {Env} = require("./entities/environment");

// setup database connection and routing
if (process.env.ENV !== Env.production) {
  // use the .env file if not running on production
  require("dotenv").config();
}
const pool = require("./services/db/mysqlPool").pool;
const app = require("./api/index");

// confirm that connection was made to the database
async function testConnection(pool, attempt, callback) {
  try {
    await pool.query("SELECT courseId FROM Course WHERE courseId = 1");
    console.log("Connected to database");
    callback();
  } catch (err) {
    if (attempt < 5) {
      console.log(`Attempt ${attempt}: Error connecting to database...\nRestarting...`);
      testConnection(pool, attempt + 1, callback);
    } else {
      console.log(`Final Attempt: Error connecting to database\n`, err);
    }
  }
}

// listen for incoming requests
const port = process.env.PORT || 5000;
testConnection(pool, 1, () => {
  app.listen(port, () => {
    console.log("Server is listening on port", port, "\n");
  });
});
