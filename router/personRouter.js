const express = require("express");
var router = express.Router();

var person = require("../lib/person");

router.get("/view/:type", (req, res) => {
  person.view(req, res);
});

router.get("/create", (req, res) => {
  person.create(req, res);
});

router.post("/create_process", (req, res) => {
  person.create_process(req, res);
});

router.get("/update/:loginID", (req, res) => {
  person.update(req, res);
});

router.post("/update_process", (req, res) => {
  person.update_process(req, res);
});

router.get("/delete/:loginID", (req, res) => {
  person.delete_process(req, res);
});

module.exports = router;
