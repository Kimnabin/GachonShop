const db = require("../lib/dataBase");
const auth = require("./auth");

function authIsOwner(req, res) {
  // console.log(">> check is_logined : ", req.session.is_logined);
  if (req.session.is_logined) {
    return true;
  } else {
    return false;
  }
}
module.exports = {
  view: (req, res) => {
    var ops = req.params.options;
    // console.log(">>> check ops: ", ops);
    db.query("SELECT * FROM boardtype", (err, results) => {
      if (err) {
        throw err;
      }
      if (ops === "v") {
        var contexts = {
          menu: "menuForManager.ejs",
          who: req.session.name,
          body: "boardTypeTB.ejs",
          logined: "YES",
          boardtypeList: results,
        };
        req.app.render("home", contexts, (err, html) => {
          res.end(html);
        });
      } else if (ops === "u") {
        var contexts = {
          menu: "menuForManager.ejs",
          who: req.session.name,
          body: "boardType_ud.ejs",
          logined: "YES",
          boardtypeList: results,
        };
        req.app.render("home", contexts, (err, html) => {
          res.end(html);
        });
      }
    });
  },

  create: (req, res) => {
    var manager = req.session.class;
    // console.log(" >>> check class: ", manager);
    if (manager == "02") {
      var contexts = {
        menu: "menuForManager.ejs",
        who: req.session.name,
        body: "boardType_CU.ejs",
        logined: "YES",
        cu: "C",
      };
      req.app.render("home", contexts, (err, html) => {
        res.end(html);
      });
    } else {
      res.send("관리자 아닙니다.");
    }
  },

  create_process: (req, res) => {
    const post = req.body;
    var title = post.title;
    var description = post.description;
    var numPerPage = post.numPerPage;
    var write_YN = post.write_YN;
    var re_YN = post.re_YN;

    db.query(
      "INSERT INTO boardtype (title, description, write_YN, re_YN, numPerPage) VALUES (?, ?, ?, ?, ?)",
      [title, description, write_YN, re_YN, numPerPage],
      (err, results) => {
        if (err) {
          throw err;
        }
        res.redirect(`/board/type/view/v`);
        res.end();
      }
    );
  },

  update: (req, res) => {
    var typeID = req.params.typeId;
    // console.log(">>> check typeID: ", typeID);
    db.query(
      "select * from boardtype where type_id=?",
      [typeID],
      (err, result) => {
        if (err) {
          throw err;
        }
        var contexts = {
          menu: "menuForManager.ejs",
          who: req.session.name,
          body: "boardType_CU.ejs",
          logined: "YES",
          cu: "U",
          boardtype: result,
        };

        req.app.render("home", contexts, (err, html) => {
          if (err) {
            throw err;
          }
          res.end(html);
        });
      }
    );
  },

  update_process: (req, res) => {
    var post = req.body;
    var id = post.type_id;
    var title = post.title;
    var des = post.description;
    var num = post.numPerPage;
    var writeOps = post.write_YN;
    var reOps = post.re_YN;

    db.query(
      `update boardtype set title=?, description=?, write_YN=?, re_YN=?, numPerPage=? where type_id=?;`,
      [title, des, writeOps, reOps, num, id],
      (err, results) => {
        if (err) {
          throw err;
        }
        res.writeHead(302, { Location: `/board/type/view/u` });
        res.end();
      }
    );
  },

  delete_process: (req, res) => {
    var id = req.params.typeId;
    db.query(`delete from boardtype where type_id=?`, [id], (err, results) => {
      if (err) {
        throw err;
      }
      res.writeHead(302, { Location: `/board/type/view/u` });
      res.end();
    });
  },

  // handle with board table db
  view2: (req, res) => {
    // console.log(">>> check type_id: ", req.params.typeId);
    // console.log(">>> check pNum: ", req.params.pNum);
    var type_id = req.params.typeId;
    var pNum = req.params.pNum;
    var isOwner = authIsOwner(req, res);

    // console.log(">>> check IsOwner in board table", isOwner);

    db.query("select * from board", (err, results) => {
      if (err) {
        throw err;
      }
      if (isOwner) {
        if (req.session.class == "1") {
          if (type_id == 1 && pNum == 1) {
            var context = {
              menu: "menuForCustomer.ejs",
              who: req.session.name,
              body: "board_bf_login.ejs",
              logined: "YES",
              board: results,
              btn: "",
            };
          } else if (type_id == 2 && pNum == 1) {
            var context = {
              menu: "menuForCustomer.ejs",
              who: req.session.name,
              body: "board_bf_login.ejs",
              logined: "YES",
              board: results,
              btn: `<a href="/board/create/1" class="btn btn-info me-md-2 btn-by-me">글쓰기</a>`,
            };
          }
        } else if (req.session.class == "02") {
          if (type_id == 1 && pNum == 1) {
            var context = {
              menu: "menuForManager.ejs",
              who: req.session.name,
              body: "board_bf_login.ejs",
              logined: "YES",
              board: results,
              btn: `<a href="/board/create/02" class="btn btn-info me-md-2 btn-by-me">글쓰기</a>`,
            };
          } else if (type_id == 2 && pNum == 1) {
            var context = {
              menu: "menuForManager.ejs",
              who: req.session.name,
              body: "board_bf_login.ejs",
              logined: "YES",
              board: results,
              btn: `<a href="/board/create/02" class="btn btn-info me-md-2 btn-by-me">글쓰기</a>`,
            };
          }
        }
      } else {
        if (type_id == 1 && pNum == 1) {
          var context = {
            menu: "menuForCustomer.ejs",
            who: "손님",
            body: "board_bf_login.ejs",
            logined: "NO",
            board: results,
            btn: "",
          };
        } else if (type_id == 2 && pNum == 1) {
          var context = {
            menu: "menuForCustomer.ejs",
            who: "손님",
            body: "board_bf_login.ejs",
            logined: "NO",
            board: results,
            btn: "",
          };
        }
      }

      req.app.render("home", context, (err, html) => {
        if (err) {
          throw err;
        }
        res.end(html);
      });
    });
  },

  detail: (req, res) => {
    var isOwner = authIsOwner(req, res);
    var boardID = req.params.boardId;
    var pID = req.params.pNum;

    // console.log(">>> check board_id: ", boardID);
    // console.log(">>> check pID: ", pID);

    db.query(
      "select * from board where board_id=? and p_id=?",
      [boardID, pID],
      (err, results) => {
        if (err) {
          throw err;
        }

        var btn_update = "";
        var btn_delete = "";

        // console.log(">>> results-loginid : ", results[0].loginid);

        if (results[0].loginid == req.session.name) {
          // Condition is true, user is the owner
          btn_update = `<a href="/board/update/${results[0].board_id}/${results[0].type_id}/${results[0].p_id}" class="btn btn-outline-primary btn-sm">수정</a>`;
          btn_delete = `<a href="/board/delete/${results[0].board_id}/${results[0].type_id}/${results[0].p_id}" class="btn btn-outline-primary btn-sm">삭제</a>`;
        }
        if (isOwner) {
          if (req.session.class == "02") {
            var context = {
              menu: "menuForCustomer.ejs",
              who: req.session.name,
              body: "board_information.ejs",
              logined: "YES",
              board: results,
              btn_up: `<a href="/board/update/${results[0].board_id}/${results[0].type_id}/${results[0].p_id}" class="btn btn-outline-primary btn-sm">수정</a>`,
              btn_de: `<a href="/board/delete/${results[0].board_id}/${results[0].type_id}/${results[0].p_id}" class="btn btn-outline-primary btn-sm">삭제</a>`,
            };
          } else if (req.session.class == 1) {
            var context = {
              menu: "menuForCustomer.ejs",
              who: req.session.name,
              body: "board_information.ejs",
              logined: "YES",
              board: results,
              btn_up: btn_update,
              btn_de: btn_delete,
            };
          }
        } else {
          var context = {
            menu: "menuForCustomer.ejs",
            who: "손님",
            body: "board_information.ejs",
            logined: "NO",
            board: results,
            btn_up: btn_update,
            btn_de: btn_delete,
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

  create2: (req, res) => {
    var isOwner = authIsOwner(req, res);
    if (isOwner) {
      if (req.session.class == "1") {
        db.query("SELECT * FROM board");
        var context = {
          menu: "menuForCustomer.ejs",
          who: req.session.name,
          body: "boardCreate.ejs",
          logined: "YES",
          ops: "N",
        };
        req.app.render("home", context, (err, html) => {
          res.end(html);
        });
      } else if (req.session.class == "02") {
        var context = {
          menu: "menuForManager.ejs",
          who: req.session.name,
          body: "boardCreate.ejs",
          logined: "YES",
          ops: "M",
        };

        req.app.render("home", context, (err, html) => {
          res.end(html);
        });
      }
    }
  },

  create_process2: (req, res) => {
    var post = req.body;
    var typeId = post.type_id;
    var pId = post.p_id;
    var loginId = post.loginid;
    var pwd = post.password;
    var title = post.title;
    var date = post.date;
    var content = post.content;

    db.query(
      `insert into board (type_id, p_id, loginid, password, title, date, content) value ( ?, ?, ?, ?, ?, ?, ?)`,
      [typeId, pId, loginId, pwd, title, date, content],
      (err, results) => {
        if (err) {
          throw err;
        }
        res.redirect(`/board/view/2/1`);
        res.end();
      }
    );
  },

  update2: (req, res) => {
    var board_id = req.params.boardId;
    var type_id = req.params.typeId;
    var p_id = req.params.pNum;
    var isOwner = authIsOwner(req, res);

    db.query(
      `select * from board where board_id = ? and type_id = ? and p_id = ?`,
      [board_id, type_id, p_id],
      (err, result) => {
        if (err) {
          throw err;
        }
        if (isOwner && req.session.class == 1) {
          var context = {
            menu: "menuForCustomer.ejs",
            who: req.session.name,
            body: "boardUpdate.ejs",
            logined: "YES",
            board: result,
          };
        } else if (isOwner && req.session.class == "02") {
          var context = {
            menu: "menuForManager.ejs",
            who: req.session.name,
            body: "boardUpdate.ejs",
            logined: "YES",
            board: result,
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

  update_process2: (req, res) => {
    var post = req.body;
    var board_id = post.board_id;
    var type_id = post.type_id;
    var p_id = post.p_id;
    var title = post.title;
    var content = post.content;

    db.query(
      `update board set title=?, content=? where board_id=? and type_id=? and p_id=?`,
      [title, content, board_id, type_id, p_id],
      (err, result) => {
        if (err) {
          throw err;
        }
        res.writeHead(302, { Location: `/board/view/2/1` });
        res.end();
      }
    );
  },

  delete_process2: (req, res) => {
    var board_id = req.params.boardId;
    var type_id = req.params.typeId;
    var p_id = req.params.pNum;

    db.query(
      `delete from board where board_id=? and type_id=? and p_id=?`,
      [board_id, type_id, p_id],
      (err, result) => {
        if (err) {
          throw err;
        }
        res.writeHead(302, { Location: `/board/view/2/1` });
        res.end();
      }
    );
  },
};
