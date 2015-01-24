"use strict";
var npModelCat = require('../../../model/category'); 
var util = require('util');
var category = {
		
		/*
	     * info : list all cat.
	     * @param req
	     * @param res
	     * @param next
	     */

		list : function(req, res){
	      res.render('category/list.ejs', 
	          { title: 'Manage Categories'});
	    },

		/*
	     * info : getby cat
	     * @param req request
	     * @param res response
	     */
	    info : function(req, res, next){
	    	npModelCat.by_id(req.params.id,function(err,cats){
	            if(!err){
				  req.alldata = {};
				  for(var index in cats){
	               req.alldata[cats[index].id] = cats[index];
	              }
				  util.log(util.inspect(req.alldata));
				  next();
	            } else{
				  console.log('Error in fetching cats');
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
		  npModelCat.by_id(null, function(err,cats){
			  if(!err){
					if (req.params.id) {
					 data = req.alldata[req.params.id];
					}
					alldata = cats;
					res.render('category/addedit.ejs', 
						{	 
						title: 'Add/Edit Category',
						data: data,
						alldata: alldata
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
	    		npModelCat.del(id, function(err, result){
	        		if(!err){
	        			console.log('Category deleted successfully');
	        			res.redirect('/category');
	        		}
	        	});
	    	}
	    	else{
	    		res.redirect('/category')
	    	}
	    	
	    },
		
		/*
	     * info : save cat
	     * @param req request
	     * @param res response
	     */
	    save:function(req,res){
	    	var catid = (req.body.catid)?req.body.catid:null;
	    	var data = {
	    		id:catid,
	    		name:req.body.name,
				url_key:req.body.url_key,
	    		description:req.body.description,
				is_active: req.body.is_active,
				parent_id: req.body.parent_id
	    	};
			npModelCat.save(data,function(err,result){
	    		if(!err){
	    			console.log('Category saved successfully');
	    			res.redirect('/category');
	    		} else{console.log(err);}
	    	});
	    },
	    
		
		/*
	     * info : send json for datatable and other purpose
	     * @param req request
	     * @param res response
	     */
	    json_data:function(req, res){
			npModelCat.by_id(null,function(err,cats){
	            if(!err){
					var catjson = {
	                  "sEcho": 1,
	                  "iTotalRecords": "57",
	                  "iTotalDisplayRecords": "57",
	                  "aaData": cats
					};
				    res.json(catjson);
	            }
	        });
	    }
	    
};

module.exports = category;
