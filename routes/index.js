const express = require('express');
const router = express.Router();
const url = require('url');
const nodemailer = require('nodemailer');
const userController = require('../controllers/user.controller');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page mean main page of website will show
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));
//for loging page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

//for Register page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

//for contact page
router.get('/contact', forwardAuthenticated, (req, res) => res.render('contact1'));
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
router.get('/contact', forwardAuthenticated, (req, res) => res.render('contact1'));
router.post('/contact', userController.contact);

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

module.exports = router;
