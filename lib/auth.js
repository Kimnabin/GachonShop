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

    // Check if the user exists in the 'person' table
    db.query(
      "select count(*) as num from person where loginid = ? and password = ?",
      [id, pwd],
      (error, results) => {
        if (error) {
          console.error("Error in first query:", error);
          return res.status(500).send("Internal Server Error");
        }

        if (results[0].num === 1) {
          // Retrieve additional information from the 'person' table
          db.query(
            "select name, class from person where loginid = ? and password = ?",
            [post.id, post.pwd],
            (error, result) => {
              if (error) {
                console.error("Error in second query:", error);
                return res.status(500).send("Internal Server Error");
              }

              // Set session variables and redirect on successful login
              req.session.is_logined = true;
              req.session.name = result[0].name;
              req.session.class = result[0].class;
              res.redirect("/");
            }
          );
        } else {
          // Check if the user exists in the 'board' table
          // db.query(
          // "select count(*) as num from board where loginid = ? and password = ?",
          // [id, pwd],
          // (err, results1) => {
          //   if (err) {
          //     console.error("Error in third query:", err);
          //     return res.status(500).send("Internal Server Error");
          //   }

          // if (results1[0].num === 1) {
          db.query(
            "select * from board where loginid = ? and password = ?",
            [id, pwd],
            (err, results2) => {
              // Set session variables and redirect on successful login
              if (err) {
                res.redirect("/auth/login");
              }
              req.session.is_logined = true;
              req.session.name = results2[0].loginid;
              req.session.class = results2[0].type_id;
              res.redirect("/");
            }
          );
        }
      }
    );
  },

  logout_process: (req, res) => {
    // Destroy the session and redirect to the home page
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("Internal Server Error");
      }
      res.redirect("/");
    });
  },
};
