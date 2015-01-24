"use strict";

var util = require('util');
var crypt = require('../../lib/crypt'); 
var main = require('../main');
var User = require('../../model/user');

var user = {    
    login:function(req,res){
    var username = (req.body.username.trim()!='')?req.body.username.trim():null;
    var userpass = (req.body.userpass.trim()!='')?req.body.userpass.trim():null;
      if(username && userpass){
        User.by_username(username.trim(),function(result,err){
          if(!err && result[0]){
            if(crypt.isvalidpass(userpass,result[0].password)){
              delete result[0]['password'];
              delete result[0]['created_date'];
              req.session.frontuser = result[0]; 
              res.redirect('/user/myaccount');
            }  else {
				res.redirect('/user/login');	
			}
          } else {
			res.redirect('/user/login');
		  }	
        });
      }
      else{
        res.redirect('/');
      }
    },
    authenticate:function(req,res,next,username,userpass){
      res.redirect('/');
    },
    logout:function(req,res){
      req.session.frontuser = null; 
      res.redirect('/');
    },
    register:function(req,res){
      var postdata = req.body;
      var data = {};
      data.first_name = (postdata.first_name.trim()!='')?postdata.first_name.trim():null;
      data.last_name = (postdata.last_name.trim()!='')?postdata.last_name.trim():null;
      data.nickname = (postdata.nickname.trim()!='')?postdata.nickname.trim():null;
      data.email_id = (postdata.email_id.trim()!='')?postdata.email_id.trim():null;
      data.password = (postdata.password.trim()!='')?crypt.createpassword(postdata.password.trim()):null;
      data.user_type = 'Registered';
      User.save(data,function(result,err){
        if(!err){
          User.by_username(data.email_id.trim(),function(result,err){
          req.session.frontuser = result[0]; 
          res.redirect('/user/myaccount');
          });
        }
      });
    },

    registerform:function(req,res){
    //util.log(util.inspect(req.session.user));
		main.get_header(req, function(output) {
				   res.render('user/register.ejs', 
							{title:'Register', header:output[0], bcrum:output[1]}
				   );	
		});
    
    },

    loginform:function(req,res){
    //util.log(util.inspect(req.session.user));
		main.get_header(req, function(output) {
				   res.render('user/login.ejs', 
							{title:'login', header:output[0], bcrum:output[1]}
				   );	
		});
    
    },

    render:function(req,res){
      //util.log(util.inspect(req.session.user));
	  main.get_header(req, function(output) {
				   res.render('user/myaccount.ejs', 
							{title:'MyAccount', header:output[0], bcrum:output[1]}
				   );	
	  });
    }
};
module.exports = user;