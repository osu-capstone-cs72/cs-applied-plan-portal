// File: index.js
// Description: handles all API routing

const bodyParser = require("body-parser");
const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express();

// parse request bodies as JSON
router.use(bodyParser.json());

// router.use('/comment', require('./comment'));
// router.use('/course', require('./course'));
router.use('/plan', require('./plan'));
// router.use('/user', require('./user'));

// statically serve files from the public directory
router.use(express.static("views/public"));

// everything else gets a 404 error
router.get("*", (req, res) => {
  res.status(404).send("Not found");
});

module.exports = router;
