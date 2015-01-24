"use strict";
var model = require('../../../model/manufacturer'); 
var util = require('util');
var manufacturer = {
		
		/*
	     * info : list all cat.
	     * @param req
	     * @param res
	     * @param next
	     */

		list : function(req, res){
	      res.render('manufacturer/list.ejs', 
	          { title: 'Manage Manufacturer'});
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
					res.render('manufacturer/addedit.ejs', 
						{	 
						title: 'Add/Edit Manufacturer',
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
	        			console.log('Manufacturer deleted successfully');
	        			res.redirect('/manufacturer');
	        		}
	        	});
	    	}
	    	else{
	    		res.redirect('/manufacturer')
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
	    		name:req.body.name,
	    		description:req.body.description,
	    	};
			model.save(data,function(err,result){
	    		if(!err){
	    			console.log('Manufacturer saved successfully');
	    			res.redirect('/manufacturer');
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

module.exports = manufacturer;
