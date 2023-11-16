var db = require("./dataBase");

function authIsOwner(req, res) {
  console.log(">> check is_logined : ", req.session.is_logined);
  if (req.session.is_logined) {
    return true;
  } else {
    return false;
  }
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

  payMoney: (req, res) => {
    res.send("money");
  },
};
