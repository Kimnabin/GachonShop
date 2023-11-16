const express = require("express");
var router = express.Router();

var board = require("../lib/board");

router.get("/type/view/:options", (req, res) => {
  board.view(req, res);
});

router.get("/type/create", (req, res) => {
  board.create(req, res);
});

router.post("/type/create_process", (req, res) => {
  board.create_process(req, res);
});

router.get("/type/update/:typeId", (req, res) => {
  board.update(req, res);
});

router.post("/type/update_process", (req, res) => {
  board.update_process(req, res);
});

router.get("/type/delete/:typeId", (req, res) => {
  board.delete_process(req, res);
});

router.get("/view/:typeId/:pNum", (req, res) => {
  board.view2(req, res);
});

router.get("/detail/:boardId/:pNum", (req, res) => {
  board.detail(req, res);
});

router.get("/create/:typeId", (req, res) => {
  board.create2(req, res);
});

router.post("/create_process", (req, res) => {
  board.create_process2(req, res);
});

router.get("/update/:boardId/:typeId/:pNum", (req, res) => {
  board.update2(req, res);
});

router.post("/update_process2", (req, res) => {
  board.update_process2(req, res);
});

router.get("/delete/:boardId/:typeId/:pNum", (req, res) => {
  board.delete_process2(req, res);
});
module.exports = router;
