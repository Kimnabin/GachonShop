const db = require("./dataBase");

module.exports = {
  login: (req, res) => {
    var context = {
      menu: "menuForCustomer.ejs",
      who: "손님",
      body: "login_1.ejs",
      logined: "NO",
    };
    req.app.render("home", context, (err, html) => {
      res.end(html);
    });
  },

  login_process: (req, res) => {
    var post = req.body;

    var id = post.id;
    var pwd = post.pwd;

    db.query(
      "select count(*) as num from person where loginid = ? and password = ?",
      [id, pwd],
      (error, results) => {
        if (results[0].num === 1) {
          db.query(
            "select name, class from person where loginid = ? and password = ?",
            [post.id, post.pwd],
            (error, result) => {
              req.session.is_logined = true;
              req.session.name = result[0].name;
              req.session.class = result[0].class;
              res.redirect("/");
            }
          );
        } else {
          // req.session.is_logined = false;
          // req.session.name = "손님";
          // req.session.class = "99";
          res.redirect("/auth/login");
        }
      }
    );
  },
  logout_process: (req, res) => {
    req.session.destroy((err) => {
      res.redirect("/");
    });
  },
};
