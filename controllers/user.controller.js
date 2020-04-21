const bcrypt = require("bcryptjs");
const passport = require("passport");
const nodemailer = require("nodemailer");
var async = require("async");
var crypto = require("crypto");
const jwt = require('jsonwebtoken'); // Import JWT Package
require("../config/passport")(passport);
/*const { loginValidation } = require('../config/auth');*/
// Load User model
const User = require("../models/User");

//Login Function
exports.login = (req, res) => res.render("login");

//Register Funcion
exports.register = (req, res) => res.render("register");

//Handle Post Request to add a new user
exports.registerUser = async (req, res) => {
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
const emailExist = await User.findOne({email : req.body.email});
      if (emailExist) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
  const salt = await bcrypt.genSalt(10 );
    const hashpasswd = await bcrypt.hash(req.body.password, salt);
    const user = new User();
  user.name = req.body.name; 
  user.email = req.body.email;
  user.password = hashpasswd;
  temporarytoken = jwt.sign({ id: user._id }, 'shhhhh', { expiresIn: '24h' }); 
  user.temporary = temporarytoken ;
    console.log(user);
      user.save(function(err) {
        if (err) {
          console.log(err);
        }else{
        var smtpTransport = nodemailer.createTransport({
              host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          service: 'gmail', 
              auth: {
                user: 'nodestore.1100@gmail.com', 
                pass: 'malik.123'
              }
            });
            var mailOptions = {
              to: user.email,
              from: 'Localhost Staff, nodestore.1100@gmail.com',
              subject: 'Account Confirmation Link',
              text: 
                'Please click on the following link, to Confirm your Account:\n\n' +
                'http://' + req.headers.host + '/activate/' + user.temporary + '\n\n' +
                'If you did not request this, please ignore this email..\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
              console.log('mail sent');
              
            });
      res.render('register',{ success_msg :'Account Registered But not yet Activated. Account Confirmation link sent to your ' + user.email + ' Please Click on the link to Activate your account'}); 
        }
        });
      }
  }
};


exports.loginUser =  async (req,res,next) => {
//  Check if user is  exist in database or not
User.findOne({email : req.body.email} , async function(err,user){
  if (!user) {
       err = "Email or Password is Incorrect";
      res.render('login',{'err' : err});
  }
  if (user) {
    if (!user.active) {
        err = "Account is Not yet Activated, Check your email to activate your account.";
          res.render('login',{'err' : err});
      }
      if(user.active){
        //  Its's Only Matched the Encrypted Password....
          const validPass = await bcrypt.compare(req.body.password,user.password);
          if (!validPass) {
            err = "Email or Password is Incorrect";
            res.render('login',{'err' : err});
            }
          if (validPass) {
                  passport.authenticate('local', {
                    successRedirect: "/dashboard",
                    failureRedirect: "/users/login",
                    failureFlash: true,
                  })(req, res, next);
              }
            }
  }
});
};

/*//Handle post request to Login a user
exports.loginUser = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
};*/

//Handle get request for contact us
exports.contact=(req, res) => {
  console.log("Request Received ...... ",req.body);
  var name = req.body.firstName+ " " + req.body.lastName;
  var email = req.body.email;
  var enquiry = req.body.message;
  var subject=req.body.subject;

  var emailMessage = `Hi Admin  ${name},\n\nContact You.\n\nCustomer email is: ${email}.\n\nCustomer enquiry is: ${enquiry}\n.`;

  console.log(emailMessage);

// Transpoter
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nodestore.1100@gmail.com',
      pass: 'malik.123'
    }
  });

  var emailOptions = {
    from: '"Store Mail" <areejarshad1100@gmail.com>',
    to: email,
    to: 'Abubakarzoomii@gmail.com',
    cc: 'nodestore.1100@gmail.com',
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

//Handle to request For reset password
exports.forget = (req, res, next) => {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },

    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forget');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 36000000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
     secure: true,
         service : 'gmail',
         auth: {
           user: 'nodestore.1100@gmail.com', 
           pass: 'malik.123'
         }
       });
       var mailOptions = {
        to: user.email,
        from: 'nodestore.1100@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/new_pass/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        //req.flash('success_msg', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.render('pass-reset1');
  });
};

exports.new_pass =  function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.render('forget');
    }
    res.render('reset', {token: req.params.token});
  });
};

exports.reset_pass =  async (req, res) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } } , async (err, user) => {
        if (err) throw err; // Throw error if cannot connect
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.render('newpass');
          }
        if (req.body.password == null || req.body.C_password == '') {
          req.flash('error', 'Password not Provided');
            return res.render('newpass');
        } else {
      const salt = await bcrypt.genSalt(10 );
      const hashpasswd = await bcrypt.hash(req.body.password, salt);
              user.password = hashpasswd; // Save user's new password to the user object
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
          //user.resettoken = false; // Clear user's resettoken 
          // Save user's new data
         const saveUser = await user.save(function(err) {
            if (err) {
              res.json({ success: false, message: err });
            } else {
              var smtpTransport = nodemailer.createTransport({
              service: 'gmail', 
              auth: {
                user: 'nodestore.1100@gmail.com', 
                pass: 'malik.123'
              }
            });
  // Create e-mail object to send to user
  var email = {
    from: 'Localhost Staff, nodestore.1100@gmail.com',
    to: user.email,
    subject: 'Reset Password',
    text: 'Hello ' + user.name + ', This e-mail is to notify you that your password was recently reset at localhost.com',
    html: 'Hello<strong> ' + user.name + '</strong>,<br><br>This e-mail is to notify you that your password was recently reset at localhost.com'
  }
  console.log(email);
  // Function to send e-mail to the user
  smtpTransport.sendMail(email, function(err) {
    req.flash('success_msg', 'Success! Your password has been changed.');
  });
 /* res.json({ success: true, message: 'Password has been reset!' }); // Return success message*/
  res.redirect('/login');
          } 
        })
      }
    });
  }
// Logout already logined user
exports.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
};

exports.activate = async function(req, res) {
User.findOne({ temporary : req.params.temporarytoken } , async function (err, user) {
const token = req.params.temporarytoken;
console.log(token);
jwt.verify(token, 'shhhhh', async (err, decoded) => {
      if (err) {
          console.log(err);
          err = "Activation Token is Invalid or Expired...";
            res.render('register', {'err' : err});
      }
        if (!token) {
          console.log(token);
          err = "Activation Token is Invalid or Expired...";
            res.render('register', {'err' : err});
      }
      if (!user) {
          console.log(token);
          err = "Activation Token is Invalid or Expired...";
            res.render('register', {'err' : err});
      }
      if (!decoded) {
        console.log(decoded);
          err = "Activation Token is Invalid or Expired...";
            res.render('register', {'err' : err});
            // Token may be valid but does not match any user in the database
      }if (decoded){
         user.active = true;
         user.temporary = false;
        /*await User.update({ active : true , temporary : false} , { where : { idd } });*/
          user.save(function(err) {
            if (err) {
              console.log(err); // If unable to save user, log error info to console/terminal
            } else {
                const smtpTransport = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                    service: 'gmail', 
                    auth: {
                      user: 'nodestore.1100@gmail.com', 
                      pass: 'malik.123'
                    }
                  });
              // If save succeeds, create e-mail object
              var email = {
                from: 'Localhost Staff, staff@localhost.com',
                to: user.email,
                subject: 'Localhost Account Activated',
                text: 'Hello ' + user.name + ', Your account has been successfully activated!',
                html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Your account has been successfully activated!'
              };

              // Send e-mail object to user
               smtpTransport.sendMail(email, function(err) {
                if (err) console.log(err); // If unable to send e-mail, log error info to console/terminal
              });
                res.render('login',{ success_msg :'Account activated!.. Please Login'});  
            }
          });
      }
        });
      });
};