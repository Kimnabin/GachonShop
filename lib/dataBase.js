const express = require("express");
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "webdb2023",
});

db.connect((err, results) => {
  console.log("Connected to database");
});
module.exports = db;
