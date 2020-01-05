console.log("Server JavaScript start");
var bodyParser = require('body-parser');
var express = require('express');
var mysql = require('mysql');
var path = require('path');
var fs = require('fs');
var app = express();
var port = process.env.PORT || 3306;

// create database connection using environment variables
var con = mysql.createConnection({
    //    host: process.env.SQL_HOST,
    //    user: process.env.SQL_USER,
    //    password: process.env.SQL_PASSWORD,
    //    database: process.env.SQL_DB_NAME
    host: "sql3.freesqldatabase.com",
    user: "sql3317654",
    password: "B5AVPkNRNz",
    database: "sql3317654"
});

// connect to the database
con.connect(function (err) {

    if (err) console.log(err);
    console.log("Connected to database");

});

//////////////////////////////////////
////*Express Middleware Functions*////
//////////////////////////////////////

// parse request bodies as JSON
app.use(bodyParser.json());

// submit the user's plan to the database
app.post('/appliedplanportal/form', function (req, res, next) {

    con.query('select firstName, lastName from User', function (err, result, fields) {
        if (err) {
            res.status(500).send("Error saving plan");
            throw err;
        } else {
            res.status(200).send("Plan saved");
            console.log(result);
        }
    });

});

app.use(express.static('public'));

// user has requested the homepage
app.get('/', function (req, res, next) {
    console.log("Homepage")
});

// everything else gets a 404 error
app.get('*', function (req, res, next) {
    res.status(404).send;
    console.log("404");
});

// listen on the current port
var server = app.listen(port, function () {
    console.log("Server is listening on port", port);
});
