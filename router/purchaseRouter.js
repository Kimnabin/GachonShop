const express = require("express");
const router = express.Router();

var purchase = require("../lib/purchase");

router.get("/detail/:mer_id", (req, res) => {
  purchase.itemPayView(req, res);
});

router.get("/", (req, res) => {
  purchase.payMoney(req, res);
});
module.exports = router;
