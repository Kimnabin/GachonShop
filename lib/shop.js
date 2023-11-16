const auth = require("./auth");
const db = require("./dataBase");

function authIsOwner(req, res) {
  console.log(">> check is_logined : ", req.session.is_logined);
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

      // var newResults = results.filter((item) => item.category === "0001");
      // console.log("newResults : ", newResults);

      if (results.length > 0) {
        if (isOwner) {
          console.log("class : ", req.session.class);
          console.log("name : ", req.session.name);

          if (req.session.class == "00") {
            var context = {
              menu: "Items.ejs",
              who: "손님",
              body: "Items.ejs",
            };
          } else if (req.session.class == "1") {
            // var context = {
            //   menu: "menuForCustomer.ejs",
            //   who: req.session.name,
            //   body: "Items.ejs",
            //   logined: "YES",
            //   itemLists: results,
            // };
            if (
              req.params.category == undefined ||
              req.params.category == "all"
            ) {
              var context = {
                itemLists: results,
                menu: "menuForCustomer.ejs",
                who: req.session.name,
                body: "Items.ejs",
                logined: "YES",
              };
            } else if (req.params.category == "0001") {
              var newResults = results.filter(
                (item) => item.category === "0001"
              );
              var context = {
                itemLists: newResults,
                menu: "menuForCustomer.ejs",
                who: req.session.name,
                body: "Items.ejs",
                logined: "YES",
              };
            } else if (req.params.category == "0002") {
              var newResults = results.filter(
                (item) => item.category === "0002"
              );
              var context = {
                itemLists: newResults,
                menu: "menuForCustomer.ejs",
                who: req.session.name,
                body: "Items.ejs",
                logined: "YES",
              };
            }
          } else if (req.session.class == "02") {
            // var context = {
            //   itemLists: results,
            //   menu: "menuForManager.ejs",
            //   who: req.session.name,
            //   body: "Items.ejs",
            //   logined: "YES",
            // };
            if (
              req.params.category == undefined ||
              req.params.category == "all"
            ) {
              var context = {
                itemLists: results,
                menu: "menuForManager.ejs",
                who: req.session.name,
                body: "Items.ejs",
                logined: "YES",
              };
            } else if (req.params.category == "0001") {
              var newResults = results.filter(
                (item) => item.category === "0001"
              );
              var context = {
                itemLists: newResults,
                menu: "menuForManager.ejs",
                who: "손님",
                body: "Items.ejs",
                logined: "YES",
              };
            } else if (req.params.category == "0002") {
              var newResults = results.filter(
                (item) => item.category === "0002"
              );
              var context = {
                itemLists: newResults,
                menu: "menuForManager.ejs",
                who: "손님",
                body: "Items.ejs",
                logined: "YES",
              };
            }
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
          if (
            req.params.category == undefined ||
            req.params.category == "all"
          ) {
            var context = {
              itemLists: results,
              menu: "menuForCustomer.ejs",
              who: "손님",
              body: "Items.ejs",
              logined: "NO",
            };
          } else if (req.params.category == "0001") {
            var newResults = results.filter((item) => item.category === "0001");
            var context = {
              itemLists: newResults,
              menu: "menuForCustomer.ejs",
              who: "손님",
              body: "Items.ejs",
              logined: "NO",
            };
          } else if (req.params.category == "0002") {
            var newResults = results.filter((item) => item.category === "0002");
            var context = {
              itemLists: newResults,
              menu: "menuForCustomer.ejs",
              who: "손님",
              body: "Items.ejs",
              logined: "NO",
            };
          }

          // console.log(">>> check ops_item: ", req.params.category);

          req.app.render("home", context, (err, html) => {
            // console.log(">>> check context before login: ", context);
            // console.log(">>> ", context.itemLists);
            res.end(html);
          });
        }
      } else {
        //results.length == 0
        if (isOwner) {
          // isOwner true
          if (req.session.class === "00") {
            var context = {
              menu: "Items.ejs",
              who: req.session.name,
              body: "emptyItem.ejs",
            };
          } else if (req.session.class === "01") {
            var context = {
              menu: "menuForCustomer.ejs",
              who: req.session.name,
              body: "emptyItem.ejs",
            };
          } else if (req.session.class == "02") {
            var context = {
              itemLists: results,
              menu: "menuForManager.ejs",
              who: req.session.name,
              body: "emptyItem.ejs",
              logined: "YES",
            };
          }
          req.app.render("home", context, (err, html) => {
            res.end(html);
          });
        } else {
          var context = {
            menu: "menuForCustomer.ejs",
            who: "손님",
            body: "emptyItem.ejs",
          };
          req.app.render("home", context, (err, html) => {
            res.end(html);
          });
        }
      }
    });
  },

  search: (req, res) => {
    var post = req.body;
    // console.log(">check value search: ", post.titleSearch);
    var isOwner = authIsOwner(req, res);
    db.query(
      `select * from merchandise 
       where name like '%${post.titleSearch}%' or brand like '%${post.titleSearch}%' or supplier like '%${post.titleSearch}%'`,
      (err, result) => {
        if (err) {
          throw err;
        }
        if (isOwner) {
          if (req.session.class == "1") {
            var context = {
              menu: "menuForCustomer.ejs",
              who: req.session.name,
              body: "Items.ejs",
              itemLists: result,
              logined: "YES",
            };
          } else if (req.session.class == "02") {
            var context = {
              menu: "menuForManager.ejs",
              who: req.session.name,
              body: "Items.ejs",
              itemLists: result,
              logined: "YES",
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
            body: "Items.ejs",
            itemLists: result,
            logined: "NO",
          };
          req.app.render("home", context, (err, html) => {
            if (err) {
              throw err;
            }
            res.end(html);
          });
        }
      }
    );
  },

  detail: (req, res) => {
    var isOwner = authIsOwner(req, res);
    var merID = req.params.mer_id;
    // console.log(">>> merID: ", merID);
    db.query(
      "select * from merchandise where mer_id=?",
      [merID],
      (err, result) => {
        if (err) {
          throw err;
        }
        if (isOwner) {
          if (req.session.class == "1") {
            var context = {
              menu: "menuForCustomer.ejs",
              who: req.session.name,
              body: "ItemsInfomation.ejs",
              itemLists: result,
              logined: "YES",
              btn: `<a href="/purchase/detail/${merID}" class="pricing-button">구입하기</a>
                    <a href="" class="pricing-button">장바구이</a>`,
            };
          }
          if (req.session.class == "02") {
            var context = {
              menu: "menuForManager.ejs",
              who: req.session.name,
              body: "ItemsInfomation.ejs",
              itemLists: result,
              logined: "YES",
              btn: `<a href="/purchase/detail/${merID}" class="pricing-button">구입하기</a>
                    <a href="" class="pricing-button">장바구이</a>`,
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
            body: "ItemsInfomation.ejs",
            itemLists: result,
            logined: "NO",
            btn: "",
          };
          req.app.render("home", context, (err, html) => {
            if (err) throw err;
            res.end(html);
          });
        }
      }
    );
  },
};
