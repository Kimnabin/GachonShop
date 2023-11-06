const express = require("express");
const app = express();
const path = require("path");
// config engine ejs
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
// config static files
app.use(express.static(path.join(__dirname, "public")));
//사용자 정의 모듈
var rootRouter = require("./router/rootRouter");
var authRouter = require("./router/authRouter");
var merchandiseRouter = require("./router/merchandiseRouter");
// 세션 모듈, 세션 DB 저장 모듈
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
var options = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "webdb2023",
};
var sessionStore = new MySQLStore(options);

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  })
);

//body parser module
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
// Router using

app.use("/auth", authRouter);
app.use("/", rootRouter);
app.use("/merchandise", merchandiseRouter);

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
