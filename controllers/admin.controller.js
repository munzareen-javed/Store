const _ = require("lodash");
const express = require('express');
const userS = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register =  async (req,res) => {
  let err = [] ;
  let success_msg = [];
  const { name, email, password } = req.body;
console.log(req.body.name);
console.log(req.body.email);
console.log(req.body.password);

    //  Check if user is already exist in database or not
  const emailExist = await userS.findOne({email : req.body.email});
  if (emailExist) {
    res.render('add_user',{ err : "Email Already Exist, Please choose different" });
  }
  if (!emailExist){
  // Hash Password
    const salt = await bcrypt.genSalt(10 );
    const hashpasswd = await bcrypt.hash(req.body.password, salt);
      //  Create a New User
  const user = new userS({
    name : req.body.name,
    email : req.body.email,
    password : hashpasswd,
    active : true
  });
  try{
    const saveUser = await user.save();
    return res.redirect('all');
  }catch(err){
    res.status(400).send(err);
  }
};
};

exports.all = (req, res) => {
  userS.find(function(err, result) {
    if (err) {
        err = "Sorry, No records Found";
       return res.render('admin',{ user : result , 'err' : err});
    }if (!result) {
      res.render('admin',{user : result , err : "No Record Found"});
    }
    if (result) {
    res.render('admin',{user : result});
    console.log(result);
    }
  });
};

exports.update = async (req, res) => {
  const id = { _id: req.params.id };
  userS.findById(id,function(err,result){
  if (err) throw err;
   res.render('edit_user',{user : result});
   console.log("update hony wala result : "+result);
     });
  };

exports.updateone = async (req, res) => {
  let err = [];
    const salt = await bcrypt.genSalt(10 );
    const hashpasswd = await bcrypt.hash(req.body.password, salt);
  name = req.body.name; 
  email = req.body.email; 
  password = hashpasswd;
  const all = {name , email , password} ;
   const id =  req.body.id;
   console.log("Id or user : "+id);
  userS.findByIdAndUpdate(id, {$set:all} ,function(err,result){
  if (err) {
    res.render('edit_user',{ user : result , err : "Error during Update, please try again"});
  }
  console.log("Thats : "+result);
   res.redirect('/admin/all');
     });
  //res.send(await userS.findById(req.params.id));
  };


exports.delete = async (req, res) => {
const id = { _id: req.params.id };
userS.find((err,result)=>{
  if (result) {
      userS.findByIdAndDelete( id ,(err,result)=>{
      if (err) {
           return res.render('admin',{ user : result , err : "Failed to delete record, try again" });
        }
/*        res.render('users',{user : result , err : "Record deleted Successfully.." });*/
      });   
  res.redirect('/admin/all');
 /* return res.render('users',{user : result , err : "Record deleted Successfully.." });*/
  }
  });
};   
