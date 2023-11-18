const express = require("express");
const router = express.Router();

var purchase = require("../lib/purchase");

router.get("/detail/:mer_id", (req, res) => {
  purchase.itemPayView(req, res);
});

router.post("/pay", (req, res) => {
  purchase.purchase(req, res);
});

router.get("/payed", (req, res) => {
  purchase.payed(req, res);
});
module.exports = router;
