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

    db.query(
      "select * from merchandise where mer_id = ?",
      [merID],
      (err, result) => {
        console.log(">> check result: ", result);
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
              res.send("donePay");
            }
          );
        } else {
          console.log("product not found!");
        }
      }
    );
  },
};
