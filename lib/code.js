const db = require("../lib/dataBase");

module.exports = {
  view: (req, res) => {
    viewID = req.params.vu;
    // console.log(">>> viewID: " + viewID);
    db.query("SELECT * FROM merchandise", (err, result1) => {
      if (err) {
        throw err;
      }
      db.query("SELECT * FROM code_tbl", (err, result2) => {
        if (err) {
          throw err;
        }
        if (viewID == "v") {
          var context = {
            menu: "menuForManager.ejs",
            who: req.session.name,
            body: "code.ejs",
            logined: "YES",
            code_Lists: result2,
            mer_Lists: result1,
          };
        } else if (viewID == "u") {
          var context = {
            menu: "menuForManager.ejs",
            who: req.session.name,
            body: "code_ud.ejs",
            logined: "YES",
            code_Lists: result2,
            mer_Lists: result1,
          };
        }

        req.app.render("home", context, (err, html) => {
          if (err) {
            throw err;
          }
          res.end(html);
        });
      });
    });
  },

  create: (req, res) => {
    db.query("SELECT * FROM code_tbl", (err, results) => {
      if (err) {
        throw err;
      }
      var contexts = {
        menu: "menuForManager.ejs",
        who: req.session.name,
        body: "codeCU.ejs",
        logined: "YES",
      };
      req.app.render("home", contexts, (err, html) => {
        if (err) {
          throw err;
        }
        res.end(html);
      });
    });
  },

  create_process: (req, res) => {
    const post = req.body;
    var mainId = post.main_id;
    var mainName = post.main_name;
    var subId = post.sub_id;
    var subName = post.sub_name;
    var startTime = post.start;
    var endTime = post.end;

    db.query(
      `INSERT INTO code_tbl (main_id, sub_id, main_name, sub_name, start, end) VALUES (?, ?, ?, ?, ?, ?)`,
      [mainId, subId, mainName, subName, startTime, endTime],
      (err, results) => {
        if (err) {
          throw err;
        }
        res.redirect(`/code/view/v`);
        res.end();
      }
    );
  },

  update: (req, res) => {
    const post = req.body;
    var mainID = req.params.main;
    var subID = req.params.sub;

    db.query(
      "select * from code_tbl where main_id=? and sub_id=?",
      [mainID, subID],
      (err, results) => {
        if (err) {
          throw err;
        }
        var contexts = {
          menu: "menuForManager.ejs",
          who: req.session.name,
          body: "codeUpdate.ejs",
          logined: "YES",
          itemLists: results,
        };
        req.app.render("home", contexts, (err, html) => {
          res.end(html);
        });
      }
    );
  },

  update_process: (req, res) => {
    const post = req.body;
    var mainName = post.main_name;
    var subName = post.sub_name;
    var startTime = post.start;
    var endTime = post.end;

    var mainId = post.main_id;
    var subId = post.sub_id;

    db.query(
      `update code_tbl set main_name=?, sub_name=?, start=?, end=? where main_id=? and sub_id=?`,
      [mainName, subName, startTime, endTime, mainId, subId],
      (err, results) => {
        if (err) {
          throw err;
        }
        res.writeHead(302, { Location: `/code/view/u` });
        res.end();
      }
    );
  },

  delete_process: (req, res) => {
    var mainId = req.params.main;
    var subID = req.params.sub;

    db.query(
      `delete from code_tbl where main_id=? and sub_id=?`,
      [mainId, subID],
      (err, results) => {
        if (err) {
          throw err;
        }
        res.writeHead(302, { Location: `/code/view/u` });
        res.end();
      }
    );
  },
};
