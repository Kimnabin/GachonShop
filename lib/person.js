const db = require("../lib/dataBase");

module.exports = {
  view: (req, res) => {
    var viewType = req.params.type;
    // console.log("view type >>> " + viewType);
    db.query("SELECT * FROM person", (err, results) => {
      if (err) {
        throw err;
      }
      if (viewType == "v") {
        var context = {
          menu: "menuForManager.ejs",
          who: req.session.name,
          body: "person.ejs",
          logined: "YES",
          personLists: results,
        };
      } else if (viewType == "u") {
        var context = {
          menu: "menuForManager.ejs",
          who: req.session.name,
          body: "person_ud.ejs",
          logined: "YES",
          personLists: results,
        };
      }
      req.app.render("home", context, (err, html) => {
        res.end(html);
      });
    });
  },
  create: (req, res) => {
    db.query("SELECT * FROM person", (err, results) => {
      if (err) {
        throw err;
      }
      var context = {
        menu: "menuForManager.ejs",
        who: req.session.name,
        body: "person_create.ejs",
        logined: "NO",
      };
      req.app.render("home", context, (err, html) => {
        if (err) {
          throw err;
        }
        res.end(html);
      });
    });
  },
  create_process: (req, res) => {
    const post = req.body;
    var useName = post.useName;
    var pass = post.pwd;
    var name = post.name;
    var address = post.address;
    var tel = post.tel;
    var birth = post.birth;
    var class_type = post.class;
    var point = post.point;

    db.query(
      "insert into person (loginid, password, name, address , tel, birth, class, point) values(?, ?, ?, ?, ?, ?, ?, ?)",
      [useName, pass, name, address, tel, birth, class_type, point],
      (err, results) => {
        if (err) {
          throw err;
        }
        res.redirect(`/person/view/v`);
        res.end();
      }
    );
  },

  update: (req, res) => {
    var userID = req.params.loginID;

    db.query(
      "select * from person where loginid=?",
      [userID],
      (err, results) => {
        if (err) {
          throw err;
        }
        var context = {
          menu: "menuForManager.ejs",
          who: req.session.name,
          body: "person_update.ejs",
          logined: "YES",
          personLists: results,
        };
        req.app.render("home", context, (err, html) => {
          res.end(html);
        });
      }
    );
  },

  update_process: (req, res) => {
    const post = req.body;

    var useName = post.useName;
    var pass = post.pwd;
    var name = post.name;
    var address = post.address;
    var tel = post.tel;
    var birth = post.birth;
    var class_type = post.class;
    var point = post.point;

    db.query(
      "update person set password=?, name=?, address=?, tel=?, birth=?, class=?, point=? where loginid=?",
      [pass, name, address, tel, birth, class_type, point, useName],
      (err, results) => {
        if (err) {
          throw err;
        }
        res.writeHead(302, { Location: `/person/view/u` });
        res.end();
      }
    );
  },
  delete_process: (req, res) => {
    var userName = req.params.loginID;
    db.query(
      "delete from person where loginid=?",
      [userName],
      (err, results) => {
        if (err) {
          throw err;
        }
        res.writeHead(302, { Location: `/person/view/u` });
        res.end();
      }
    );
  },
};
