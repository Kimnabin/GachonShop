const db = require("./dataBase");

function authIsOwner(req, res) {
  console.log(req.session.is_logined);
  if (req.session.is_logined) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  home: (req, res) => {
    db.query("SELECT * FROM merchandise", (err, results) => {
      // console.log("Check results", results);
      var isOwner = authIsOwner(req, res);
      console.log("isOwner : ", isOwner);
      // check results
      if (results.length > 0) {
        if (isOwner) {
          console.log("class : ", req.session.class);
          console.log("name : ", req.session.name);

          if (req.session.class === "00") {
            var context = {
              menu: "Items.ejs",
              who: req.session.name,
              body: "Items.ejs",
            };
          } else if (req.session.class === "01") {
            var context = {
              menu: "menuForCustomer.ejs",
              who: req.session.name,
              body: "Items.ejs",
            };
          } else if (req.session.class == "02") {
            var context = {
              itemLists: results,
              menu: "menuForManager.ejs",
              who: req.session.name,
              body: "Items.ejs",
              logined: "YES",
            };
          } else {
            var context = {
              menu: "menuForCustomer.ejs",
              who: "손님",
              body: "Items.ejs",
              // logined: "NO",
            };
          }
          req.app.render("home", context, (err, html) => {
            res.end(html);
          });
        } else {
          var context = {
            itemLists: results,
            menu: "menuForCustomer.ejs",
            who: "손님",
            body: "Items.ejs",
            logined: "NO",
          };

          req.app.render("home", context, (err, html) => {
            // console.log(">>> ", context.itemLists);
            res.end(html);
          });
        }
      } else {
        var context = {
          menu: "menuForCustomer.ejs",
          who: req.session.name,
          body: "Items.ejs",
          logined: "NO",
        };

        req.app.render("home", context, (err, html) => {
          // console.log(">>> ", context.itemLists);
          res.end(html);
        });
      }
    });
  },
};
