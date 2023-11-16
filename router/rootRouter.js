const express = require("express");
var router = express.Router();

var shop = require("../lib/shop");

router.get("/", (req, res) => {
  shop.home(req, res);
});

router.get("/shop/:category", (req, res) => {
  shop.home(req, res);
});

router.post("/shop/search", (req, res) => {
  shop.search(req, res);
});

router.get("/shop/detail/:mer_id", (req, res) => {
  shop.detail(req, res);
});

module.exports = router;
