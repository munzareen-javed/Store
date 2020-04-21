const express = require('express');
const router = express.Router();
const url = require('url');
const nodemailer = require('nodemailer');
const User = require("../models/User");
const userController = require('../controllers/user.controller');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page mean main page of website will show
router.get('/', forwardAuthenticated, (req, res) => { res.render('welcome',{ user: req.user }) });
//for loging page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

//for Register page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

//for contact page
router.get('/contact', (req, res) => {
	res.render('contact',{ user: req.user });
	console.log(req.user);
});
router.post('/contact',userController.contact);
//for contact success
router.get('/contactSuccess', (req, res) => {
  console.log('Request for contact send page recieved');
  res.render('contactSuccess');
});
//for contact failed
router.get('/contactError', (req, res) => {
  console.log('Request for contact error page recieved');
  res.render('contactError');
});


//for contact page
/*router.get('/contact', forwardAuthenticated, (req, res) => res.render('contact1'));*/
/*router.post('/contact', userController.contact);*/

// forget password
router.get('/forget', (req, res) => res.render('forget'));
router.post('/forget',userController.forget);
//reset password
router.get('/new_pass/:token',userController.new_pass);
router.post('/reset_pass/:token',userController.reset_pass);
router.get('/activate/:temporarytoken',userController.activate);

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user });
});

module.exports = router;
