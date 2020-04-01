const bcrypt = require("bcryptjs");
const passport = require("passport");
// Load User model
const User = require("../models/User");

//Login Function
exports.login = (req, res) => res.render("login");

//Register Funcion
exports.register = (req, res) => res.render("register");

//Handle Post Request to add a new user
exports.registerUser = (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
};

//Handle post request to Login a user
exports.loginUser = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
};

//Handle get request for contact us
exports.contact=(req, res) => {
  console.log("Request Received ...... ",req.body);
  var name = req.body.firstName+ " " + req.body.lastName;
  var email = req.body.email;
  var enquiry = req.body.message;
  var subject=req.body.subject;

  var emailMessage = `Hi Admin  ${name},\n\nContact You.\n\nCustomer email is: ${email}.\n\nCustomer enquiry is: ${enquiry}\n.`;

  console.log(emailMessage);

  // res.redirect('/contactSuccess');

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'areejarshad1100@gmail.com',
      pass: 'shaikh.123'
    }
  });

  var emailOptions = {
    from: email,
    to: 'areejansari49@gmail.com',
    cc:'areejarshad1100@gmail.com',
    subject: subject,
    text: emailMessage
  };

  //res.redirect ('/contactError');
  transporter.sendMail(emailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.redirect('/contactError');
    } else {
      console.log('Message Sent: ' + info.response);
      console.log('Email Message: ' + emailMessage);
      res.redirect('/contactSuccess');
    }
  });
}

// Logout already logined user
exports.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
};
