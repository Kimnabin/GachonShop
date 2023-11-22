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

router.get("/cancel/:purchase_id/:mer_id", (req, res) => {
  purchase.cancel(req, res);
});

router.get("/card", (req, res) => {
  purchase.card(req, res);
});

router.post("/pay2", (req, res) => {
  purchase.purchase2(req, res);
});

router.get("/cancel_all", (req, res) => {
  purchase.cancel_All(req, res);
});

router.get("/delete/:purchase_id", (req, res) => {
  purchase.delete(req, res);
});
module.exports = router;
