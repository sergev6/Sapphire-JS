var User = require('./../../model/user'); 
var crypt = require('../../lib/crypt'); 
var general = require('./../../model/general'); 

var util = require('util');

var main = {    
    
	/*
     * info : Login Admin System
     */
    dashboard:function(req,res,next){
			var dashdata = {};
			general.get_user_count(function(ucount){
	        	dashdata.ucount = ucount;
				general.get_order_count(function(orderobj){
	        		dashdata.ocount = orderobj.ocount;
					dashdata.totalsales = orderobj.totalsales;
					general.get_today_earning(function(todayearning){
						dashdata.todayearning = (todayearning)?todayearning:'0';	
						general.get_month_earning(function(monthobj){
								dashdata.monthearning = (monthobj.monthearning)?monthobj.monthearning:'0';	
								dashdata.monthname = (monthobj.monthname)?monthobj.monthname:'0';	
								general.get_order_product_count(function(probj){
									dashdata.sales = probj.sales;
									dashdata.graph = probj.graph;
										res.render('index.ejs', 
										{	 
											dashdata: dashdata,
										}
									);
								});
						});
					}); // end of today
				});		
	        });
    },

	/*
     * info : Login Admin System
     */
    auth:function(req,res,next){
	  if(!req.session.adminuser && req.url!='/login/'){
		//req.session.adminuser = 'amit';
		//next();
		res.redirect('/login/');
      } else {
        next();
      } 
    },
    login:function(req,res){
		//return;
		//req.session.adminuser = 'amit';
		//res.redirect('/');
	   if(req.body.adminusername && req.body.adminusername.trim()!=''){
        var admin_user = req.body.adminusername.trim();
        if(req.body.adminpass && req.body.adminpass.trim()!=''){
          var admin_password = req.body.adminpass.trim();
          User.isAdminUser(admin_user,function(result,err){
            if(!err && result[0]){
              console.log(result);
              if(crypt.isvalidpass(admin_password,result[0].password)){
              delete result[0].password;
              req.session.adminuser = result[0];
              console.log(req.session.adminuser);
              res.redirect('/');
              } else {
				  res.redirect('/login');
			  }
            } else {
				  res.redirect('/login');
			}
          });
        }
      }
    }
    
};

module.exports = main;
