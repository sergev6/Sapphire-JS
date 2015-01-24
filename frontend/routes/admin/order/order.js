"use strict";
var model = require('../../../model/order'); 
var util = require('util');
var fs = require('fs');
var uploadfs = require('uploadfs')();
//upload = require('jquery-file-upload-middleware');
var uploadsPath = 'media';
var tempPath = 'temp';

var order = {
		
		/*
	     * info : list all cat.
	     * @param req
	     * @param res
	     * @param next
	     */

		list : function(req, res){
	      res.render('order/list.ejs', 
	          { title: 'Manage Order'});
	    },

		/*
	     * info : getby cat
	     * @param req request
	     * @param res response
	     */
	    info : function(req, res, next){
	    	model.by_id(req.params.id,function(err,rdata){
	            if(!err){
				  req.alldata = {};
				  for(var index in rdata){
	               req.alldata[rdata[index].id] = rdata[index];
	              }
				  util.log(util.inspect(req.alldata));
				  next();
	            } else{
				  console.log('Error in fetching rdata');
				  next();
				}
	        });
	    },
	    
		/*
	     * info : add/edit all cat.
	     * @param req
	     * @param res
	     * @param next
	     */
	    addedit : function(req, res) {
		  var data = {};
		  var alldata = {};
			if (req.params.id) {
			 data = req.alldata[req.params.id];
			}
			var S = require('string');
			var locals = { checkStr: function(str, needle){ return S(str).indexOf(needle); }};
			res.render('order/addedit.ejs', 
				{	 
				title: 'Add/Edit Order',
				data: data,
				locals: locals		
				}
			);
 
	    },
	    
		/*
	     * info : delete cat
	     * @param req request
	     * @param res response
	     */
	    del : function(req,res){    	
	    	var id = req.params.id;
	    	if(id){
	    		model.del(id, function(err, result){
	        		if(!err){
	        			console.log('Order deleted successfully');
	        			res.redirect('/order');
	        		}
	        	});
	    	}
	    	else{
	    		res.redirect('/order')
	    	}
	    	
	    },
		
		/*
	     * info : save cat
	     * @param req request
	     * @param res response
	     */
	    save:function(req,res){
	    	var did = (req.body.did)?req.body.did:null;
			require('date-utils');
			var d = Date.today(); 
			var data = {
	    		id:did,
	    		firstname:req.body.firstname,
				lastname:req.body.lastname,
				email:req.body.email,
				company:req.body.company,
				address1:req.body.address1,
				address2:req.body.address2,
				city:req.body.city,
				state:req.body.state,
				country:req.body.country,
				zipcode:req.body.zipcode,
				telephone:req.body.telephone,
				fax:req.body.fax,
				sfirstname:req.body.sfirstname,
				slastname:req.body.slastname,
				semail:req.body.semail,
				scompany:req.body.scompany,
				saddress1:req.body.saddress1,
				saddress2:req.body.saddress2,
				scity:req.body.scity,
				sstate:req.body.sstate,
				scountry:req.body.scountry,
				szipcode:req.body.szipcode,
				stelephone:req.body.stelephone,
				sfax:req.body.sfax,
				
				products:req.body.products,
				paymentmethod:req.body.paymentmethod,
				status:req.body.status,
	    		orderamt:req.body.orderamt,
				currency: req.body.currency,
				discount: req.body.discount,
				tax: req.body.tax,
				shipping: req.body.shipping
	    	};
			if (!did)
			{
				data.orderdate=d.toFormat('YYYY-MM-DD HH:MI:SS');
			}
			model.save(data,function(err,result){
	    		if(!err){
	    			console.log('Order saved successfully');
	    			res.redirect('/order');
	    		} else{console.log(err);}
	    	});
	    },
	    
		
		/*
	     * info : send json for datatable and other purpose
	     * @param req request
	     * @param res response
	     */
	    json_data:function(req, res){
			model.by_id(null,function(err,rdata){
	            if(!err){
					var catjson = {
	                  "sEcho": 1,
	                  "iTotalRecords": "57",
	                  "iTotalDisplayRecords": "57",
	                  "aaData": rdata
					};
				    res.json(catjson);
	            }
	        });
	    }
	    
};

module.exports = order;
