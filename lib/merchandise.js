const db = require("../lib/dataBase");

module.exports = {
  view: (req, res) => {
    var viewID = req.params.vu;
    // console.log(">>> viewID: " + viewID);
    db.query("SELECT * FROM merchandise", (err, results) => {
      if (viewID == "v") {
        var context = {
          itemLists: results,
          menu: "menuForManager.ejs",
          who: req.session.name,
          body: "Items.ejs",
          logined: "YES",
        };
      } else if (viewID == "u") {
        var context = {
          itemLists: results,
          menu: "menuForManager.ejs",
          who: req.session.name,
          body: "merchandise.ejs",
          logined: "YES",
        };
      }

      req.app.render("home", context, (err, html) => {
        res.end(html);
      });
    });
  },

  create: (req, res) => {
    db.query("SELECT * FROM merchandise", (err, results) => {
      var context = {
        itemLists: results,
        menu: "menuForManager.ejs",
        who: req.session.name,
        body: "merchandiseCU.ejs",
        logined: "YES",
        formName: "상품 추가",
      };
      req.app.render("home", context, (err, html) => {
        res.end(html);
      });
    });
  },

  create_process: (req, res) => {
    const post = req.body;
    var itemCategory = post.category;
    var itemName = post.name;
    var itemPrice = post.price;
    var itemStock = post.stock;
    var itemBrand = post.brand;
    var itemSupplier = post.supplier;
    var itemImage = "/images/" + req.file.filename;
    var itemSale = post.sale_yn;
    var itemPriceSale = post.sale_price;

    db.query(
      `insert into merchandise (category, name, price, stock, brand, supplier, image, sale_yn, sale_price)
       value(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        itemCategory,
        itemName,
        itemPrice,
        itemStock,
        itemBrand,
        itemSupplier,
        itemImage,
        itemSale,
        itemPriceSale,
      ],
      (err, results) => {
        if (err) {
          throw err;
        }
        res.redirect(`/merchandise/view/v`);
        res.end();
      }
    );
  },
  update: (req, res) => {
    var id = req.params.merId;
    // console.log("id: ", id);

    db.query(
      `SELECT * FROM merchandise WHERE mer_id=?`,
      [id],
      function (err, results) {
        if (err) {
          throw err;
        }
        var context = {
          formName: "상품 수정",
          itemLists: results,
          menu: "menuForManager.ejs",
          who: req.session.name,
          body: "merchandiseUpdate.ejs",
          logined: "YES",
        };
        req.app.render("home", context, (err, html) => {
          res.end(html);
        });
      }
    );
  },

  update_process: (req, res) => {
    const post = req.body;
    var itemCategory = post.category;
    var itemName = post.name;
    var itemPrice = post.price;
    var itemStock = post.stock;
    var itemBrand = post.brand;
    var itemSupplier = post.supplier;
    var itemSale = post.sale_yn;
    var itemPriceSale = post.sale_price;
    var id = post.id;
    // var itemImage = "/images/" + req.file.filename;

    // console.log("id: ", post.id);

    db.query(
      `UPDATE merchandise SET category=?, name=?, price=?, stock=?, brand=?, supplier=?, sale_yn=?, sale_price=? WHERE mer_id=?`,
      [
        itemCategory,
        itemName,
        itemPrice,
        itemStock,
        itemBrand,
        itemSupplier,
        itemSale,
        itemPriceSale,
        id,
      ],
      (err, results) => {
        res.writeHead(302, { Location: `/merchandise/view/v` });
        res.end();
      }
    );
  },

  delete_process: (req, res) => {
    var id = req.params.merId;
    db.query(`DELETE FROM merchandise WHERE mer_id=?`, [id], (err, results) => {
      if (err) {
        throw err;
      }
      res.writeHead(302, { Location: `/merchandise/view/v` });
      res.end();
    });
  },
};
