var db = require("./dataBase");

function authIsOwner(req, res) {
  console.log(">> check is_logined : ", req.session.is_logined);
  if (req.session.is_logined) {
    return true;
  } else {
    return false;
  }
}

function getTimestampInSeconds() {
  return Math.floor(Date.now() / 1000);
}

module.exports = {
  itemPayView: (req, res) => {
    // console.log(">>> check merID: ", req.params.mer_id);
    var merID = req.params.mer_id;
    var isOwner = authIsOwner(req, res);

    db.query(
      "select * from merchandise where mer_id=?",
      merID,
      (err, result) => {
        if (err) {
          throw err;
        }
        if (isOwner) {
          if (req.session.class == "1") {
            var context = {
              menu: "menuForCustomer.ejs",
              who: req.session.name,
              body: "ItemPayPage.ejs",
              logined: "YES",
              itemLists: result,
            };
          } else if (req.session.class == "02") {
            var context = {
              menu: "menuForManager.ejs",
              who: req.session.name,
              body: "ItemPayPage.ejs",
              logined: "YES",
              itemLists: result,
            };
          }

          req.app.render("home", context, (err, html) => {
            if (err) {
              throw err;
            }
            res.end(html);
          });
        } else {
          var context = {
            menu: "menuForCustomer.ejs",
            who: "손님",
            body: "ItemPayPage.ejs",
            logined: "NO",
            itemLists: result,
          };

          req.app.render("home", context, (err, html) => {
            if (err) {
              throw err;
            }
            res.redirect(`/auth/login`);
            res.end(html);
          });
        }
      }
    );
  },

  purchase: (req, res) => {
    var post = req.body;
    // console.log(">>> check post:", post);
    var merID = parseInt(post.merID);
    var qty = parseInt(post.qty);
    var userID = req.session.name;
    // console.log(">>> check user: ", userID);

    var ops_btn = post.card;
    //check type button for form
    // console.log(">> check type button: ", ops_btn);
    if (ops_btn == "1") {
      //결제하기
      db.query(
        "select * from merchandise where mer_id = ?",
        [merID],
        (err, result) => {
          // var date = new Date(1700011635000).toLocaleString();
          // console.log(">>> check date: ", date);
          // console.log(">> check result: ", result);
          if (err) {
            throw err;
          }
          if (result.length > 0) {
            var itemPrice = result[0].price;
            var totalPrice = qty * itemPrice;
            var date = getTimestampInSeconds();
            var poit = totalPrice * 0.005;

            db.query(
              `insert into purchase (loginid, mer_id, date, price, point, qty, total, payYN, cancel, refund) value (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                userID,
                merID,
                date,
                itemPrice,
                poit,
                qty,
                totalPrice,
                "Y",
                "N",
                "N",
              ],
              (err, result1) => {
                if (err) {
                  throw err;
                }
                res.redirect("/purchase/payed");
                res.end();
              }
            );
          } else {
            console.log("product not found!");
          }
        }
      );
    } else if (ops_btn == "2") {
      //장바구이
      db.query(
        "select * from merchandise where mer_id = ?",
        [merID],
        (err, result) => {
          // var date = new Date(1700011635000).toLocaleString();
          // console.log(">>> check date: ", date);
          // console.log(">> check result: ", result);
          if (err) {
            throw err;
          }
          if (result.length > 0) {
            var itemPrice = result[0].price;
            var totalPrice = qty * itemPrice;
            var date = getTimestampInSeconds();
            var poit = totalPrice * 0.005;

            db.query(
              `insert into purchase (loginid, mer_id, date, price, point, qty, total, payYN, cancel, refund) value (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                userID,
                merID,
                date,
                itemPrice,
                poit,
                qty,
                totalPrice,
                "N",
                "N",
                "N",
              ],
              (err, result1) => {
                if (err) {
                  throw err;
                }
                res.redirect("/purchase/card");
                res.end();
              }
            );
          } else {
            console.log("product not found!");
          }
        }
      );
    }
  },

  payed: (req, res) => {
    var userID = req.session.name;
    db.query(
      "select * from purchase inner join merchandise on purchase.mer_id=merchandise.mer_id where loginid = ? and payYn = ?",
      [userID, "Y"],
      (err, results1) => {
        // console.log(">> check result1: ", result1);
        // res.send("donePay");
        var totalMoney = 0;
        var canceledMoney = 0;
        var newTotalMoney = 0;
        var dates = [];
        for (var i = 0; i < results1.length; i++) {
          var date = new Date(
            parseInt(results1[i].date) * 1000
          ).toLocaleString();
          dates.push(date);
          if (results1[i].refund == "Y") {
            canceledMoney += results1[i].total;
          }
          // console.log(">> check cancel money: ", canceledMoney);
          if (results1[i].payYN == "Y") {
            totalMoney += results1[i].total;
          }

          newTotalMoney = totalMoney - canceledMoney;
          // console.log(">> check new total: ", newTotalMoney);
        }

        // console.log("date: ", dates);

        if (req.session.class == "1") {
          var context = {
            menu: "menuForCustomer.ejs",
            who: req.session.name,
            body: "DonePay.ejs",
            logined: "YES",
            Items: results1,
            time: dates,
            money: newTotalMoney,
          };
        } else if (req.session.class == "02") {
          var context = {
            menu: "menuForManager.ejs",
            who: req.session.name,
            body: "DonePay.ejs",
            logined: "YES",
            Items: results1,
            time: dates,
            money: newTotalMoney,
          };
        }

        req.app.render("home", context, (err, html) => {
          if (err) {
            throw err;
          }
          res.end(html);
        });
      }
    );
  },

  cancel: (req, res) => {
    // console.log(">>> check purchase ID : ", req.params.purchase_id);
    var purchaseID = req.params.purchase_id;
    var merID = req.params.mer_id;
    var loginedId = req.session.name;
    var date = getTimestampInSeconds();

    db.query(
      "update purchase set cancel = 'Y', refund = 'Y' where purchase_id = ?",
      [purchaseID],
      (err, result) => {
        if (err) {
          throw err;
        }
        db.query(
          "insert into cart (loginid, mer_id, date) value (?, ?, ?)",
          [loginedId, merID, date],
          (err2, result2) => {
            if (err) {
              throw err2;
            }
            res.writeHead(302, { Location: `/purchase/payed` });
            res.end();
          }
        );
      }
    );
  },

  card: (req, res) => {
    var userID = req.session.name;

    db.query(
      "select * from purchase inner join merchandise on purchase.mer_id=merchandise.mer_id where loginid = ? and payYN = ?",
      [userID, "N"],
      (err, results1) => {
        // console.log(">> check result1: ", result1);
        // res.send("donePay");
        var totalMoney = 0;

        var merIDLists = [];
        var dates = [];
        for (var i = 0; i < results1.length; i++) {
          var date = new Date(
            parseInt(results1[i].date) * 1000
          ).toLocaleString();
          dates.push(date);

          if (results1[i].payYN == "N") {
            totalMoney += results1[i].total;
          }

          merIDLists.push(results1[i].purchase_id);
        }

        // console.log("date: ", dates);

        if (req.session.class == "1") {
          var context = {
            menu: "menuForCustomer.ejs",
            who: req.session.name,
            body: "bag.ejs",
            logined: "YES",
            Items: results1,
            time: dates,
            money: totalMoney,
            itemLists: merIDLists,
          };
        } else if (req.session.class == "02") {
          var context = {
            menu: "menuForManager.ejs",
            who: req.session.name,
            body: "bag.ejs",
            logined: "YES",
            Items: results1,
            time: dates,
            money: totalMoney,
            itemLists: merIDLists,
          };
        }

        req.app.render("home", context, (err, html) => {
          if (err) {
            throw err;
          }
          res.end(html);
        });
      }
    );
  },

  purchase2: (req, res) => {
    var post = req.body;
    var itemLists = post.itemLists; //mer_id Lists
    var qtyList = post.qty;
    var newItemLists = itemLists.split(",").map(Number);

    // console.log(">> PurchaseID: ", newItemLists);
    // console.log(">> qty: ", qtyList);
    for (var i = 0; i < newItemLists.length; i++) {
      db.query(
        `update purchase set qty = ?, total = (purchase.price*purchase.qty), payYN = 'Y' where purchase_id = ?`,
        [qtyList[i], newItemLists[i]],
        (err, result) => {
          if (err) {
            throw err;
          }
        }
      );
    }
    res.writeHead(302, { Location: `/purchase/payed` });
    res.end();
  },
};
