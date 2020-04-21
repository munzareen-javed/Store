//my Node project Start point

var http = require("http");
var path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("cookie-session");

const app = express();
// Passport Config
require("./config/passport.js")(passport);

require('./config/keys.js');
// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg"); 
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Route import for serving static files like css,imges etc
app.use(express.static("Public"));
// Routes
app.use("/", require("./routes/index.js"));
app.use("/users", require("./routes/users.js"));
app.use("/admin", require("./routes/admin.js"));

var port = process.env.PORT || 5001;
var server = http.createServer(app);
server.listen(port, () => {
  console.log("Server is starting = " + port);
});
