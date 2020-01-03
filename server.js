console.log("Server JavaScript start");
var express = require('express');
var app = express();
var port = process.env.PORT || 3306;

/////////////////////////////
////*Connect to database*////
/////////////////////////////

var mysql = require("mysql");

// database config using env variables
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

    // query the database to get user info
    con.query('select * from User', function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });

    // query the database to get the course info
    con.query('select * from Course', function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });

});

//////////////////////////////////////
////*Express Middleware Functions*////
//////////////////////////////////////

var server = app.listen(port, function () {
    console.log("Server is listening on port ", port);
});
