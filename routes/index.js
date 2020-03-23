const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page mean main page of website will show
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));
//for loging page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

//for Register page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));


//for contact page
router.get('/contact', forwardAuthenticated, (req, res) => res.render('contact'));
// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

module.exports = router;
