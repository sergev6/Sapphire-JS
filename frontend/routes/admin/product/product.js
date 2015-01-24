"use strict";
var model = require('../../../model/product'); 
var util = require('util');
var fs = require('fs');
var uploadfs = require('uploadfs')();
//upload = require('jquery-file-upload-middleware');
var uploadsPath = './media';
var tempPath = './temp';

var product = {
		
		/*
	     * info : list all cat.
	     * @param req
	     * @param res
	     * @param next
	     */

		list : function(req, res){
	      res.render('product/list.ejs', 
	          { title: 'Manage Product'});
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
		  var cat = require('../../../model/category'); 
		  cat.by_id(null, function(err,rdata){
			  if(!err){
					if (req.params.id) {
					 data = req.alldata[req.params.id];
					}
					alldata = rdata;
					var S = require('string');
					var locals = { checkStr: function(str, needle){ return S(str).indexOf(needle); }};
					res.render('product/addedit.ejs', 
						{	 
						title: 'Add/Edit Product',
						data: data,
						alldata: alldata,
						locals: locals		
						}
					);
		      }
		  });
	     
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
	        			console.log('Product deleted successfully');
	        			res.redirect('/product');
	        		}
	        	});
	    	}
	    	else{
	    		res.redirect('/product')
	    	}
	    	
	    },
		
		/*
	     * info : save cat
	     * @param req request
	     * @param res response
	     */
	    save:function(req,res){
	    	var did = (req.body.did)?req.body.did:null;
			var catids = '';
			if (Array.isArray(req.body.category_id)) {
				for (var id in req.body.category_id) {
					catids = catids + req.body.category_id[id] + ', ';
				} 
			}  else {
					catids = catids + req.body.category_id + ', ';
			} 
			var prodimages = req.files.productimage;
			if (prodimages) {
					var options = { 
						backend: 'local', 
						uploadsPath: uploadsPath,
						tempPath: tempPath,
						imageSizes: [
						{
						  name: 'small',
						  width: 80,
						  height: 80
						},
						{
						  name: 'medium',
						  width: 150,
						  height: 150
						},
						{
						  name: 'large',
						  width: 600,
						  height: 600
						}
					  ]
					};
					uploadfs.init(options, function() {});
					if (prodimages && prodimages.length) {
						for(var x in prodimages) {
						 if (prodimages[x] && prodimages[x].name) {
							var tmp_path = prodimages[x].path;
							console.log(tmp_path);
							uploadfs.copyImageIn(tmp_path, '/' + prodimages[x].name, function(e, info) {
								console.log(info.basePath + '.small.' + info.extension);
							});
						  }
						}
					}
			}
			// set where the file should actually exists - in this case it is in the "images" directory
			//var tmp_path = req.files.image1.path;
			// move the file from the temporary location to the intended location
			//fs.rename(tmp_path, uploadsPath + '/' + req.files.image1.name, function(err) {
			//if (err) throw err;
				// delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
				/*fs.unlink(tmp_path, function() {
				if (err) throw err;
					res.send('File uploaded to: ' + uploadsPath + ' - ' + req.files.image1.size + ' bytes');
				});*/
			//});

			require('date-utils');
			var d = Date.today(); 
			var data = {
	    		id:did,
	    		name:req.body.name,
				sku:req.body.sku,
				url_key:req.body.url_key,
	    		description:req.body.description,
				price: req.body.price,
				qty: req.body.qty,
				discount: req.body.discount,
				discount_type: req.body.discount_type,
				tax: req.body.tax,
				tax_type: req.body.tax_type,
				is_active: req.body.is_active,
				category_id:catids,
				created_date: d.toFormat('YYYY-MM-DD HH:MI:SS')
	    	};
			model.save(data,function(err,result){
	    		if(!err){
					var pimage = '';
					var oldimg = (req.body.oldimage)?req.body.oldimage:''; 
					if (prodimages && prodimages.length) {
						for(var x in prodimages) {
							if (prodimages[x] && prodimages[x].name) {
								pimage = pimage + prodimages[x].name + '#';
							}
						}
					}
					if (result.insertId) {
					  var udata = {id:result.insertId, productimage: oldimg + pimage};
					} else {
					  var udata = {id:did, productimage: oldimg + pimage}; 	
					}
					
					model.save(udata, function() {});
			
					if (req.body.delimg) {
						var delarray = req.body.delimg.split('#');
						if (delarray && delarray.length) {
							for(var i=0; i<delarray.length-1; i++) {
								uploadfs.remove('media/'+delarray[i], function(err, result){});
							}
						}
					}
	    			console.log('Product saved successfully');
	    			res.redirect('/product');
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

module.exports = product;
