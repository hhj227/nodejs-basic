const express = require("express");
const compression = require("compression");
const defaultRouter = require('./routes/default');
const topicRouter = require("./routes/topic");
const indexRouter = require("./routes/index");
const authorRouter = require("./routes/author");
const loginRouter = require("./routes/login");
const helmet = require("helmet");
const looger = require('morgan');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
var session = require('express-session')

// view engine
// app.use('views', path.join(__dirname, 'views'));
//app.set("view engine", "pug");

// custom middleware
app.use(looger('dev'));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(helmet());

app.use("*", defaultRouter);
app.use("/", indexRouter);
app.use("/topic", topicRouter);
app.use('/author', authorRouter);
app.use('/login', loginRouter);

app.use((req, res, next) => {
  res.status(404).send("Sorry cant find that!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});