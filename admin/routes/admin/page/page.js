"use strict";
var model = require('../../../model/page'); 
var util = require('util');
var page = {
		
		/*
	     * info : list all cat.
	     * @param req
	     * @param res
	     * @param next
	     */

		list : function(req, res){
	      res.render('page/list.ejs', 
	          { title: 'Manage Page'});
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
		  model.by_id(null, function(err,rdata){
			  if(!err){
					if (req.params.id) {
					 data = req.alldata[req.params.id];
					}
					alldata = rdata;
					res.render('page/addedit.ejs', 
						{	 
						title: 'Add/Edit Page',
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
	    		model.del(id, function(err, result){
	        		if(!err){
	        			console.log('Page deleted successfully');
	        			res.redirect('/page');
	        		}
	        	});
	    	}
	    	else{
	    		res.redirect('/page')
	    	}
	    	
	    },
		
		/*
	     * info : save cat
	     * @param req request
	     * @param res response
	     */
	    save:function(req,res){
	    	var did = (req.body.did)?req.body.did:null;
	    	var data = {
	    		id:did,
	    		title:req.body.title,
	    		description:req.body.description,
				url_key: req.body.url_key
	    	};
			model.save(data,function(err,result){
	    		if(!err){
	    			console.log('Page saved successfully');
	    			res.redirect('/page');
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

module.exports = page;
