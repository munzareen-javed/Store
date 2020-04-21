const express = require('express');
const router = express.Router();
// Load User Controller
const userController = require('../controllers/admin.controller');
const { forwardAuthenticated } = require('../config/auth');

//Register Routes
// Login Page
router.get('/',(req,res)=>{
	res.redirect('/admin/all');
});
router.get('/index',(req,res)=>{
	res.redirect('/admin/all');
});
router.post('/register' ,userController.register);
router.get('/all', userController.all);
router.get('/update/:id',userController.update);
router.post('/updateone',userController.updateone);
router.get('/delete/:id',userController.delete);
router.get('/add_user',(req,res)=>{
	res.render('add_user');
});

/*router.get('/all',(req,res)=>{
	console.log("Hello World");
});*/
module.exports = router;