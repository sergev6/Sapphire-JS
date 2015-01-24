var Db = require('./model.js');
var util = require('util');
var Query = require('./sql');

var general = {
      
	  get_url_value: function(key, cb) {
		Query.processquery("select url_value from url_alias where url_key='"+key+"'", function(err,result) {
			if(!err){
				if (result[0]) {
					console.log(result[0].url_value);
					cb(null, result[0].url_value);
				} else {
					Query.processquery("select id from product where url_key='"+key+"'", function(err,result) {
						if (result[0]) {
							cb(null, 'product/' + result[0].id);
						} else {
							cb(err,null);
						}
					});
				}
			}else{
				console.log(err);
				cb(err,null);
			}
		});	  
	  },

	  get_product_list: function(cid, cb) {
		Query.processquery("select * from product p where p.category_id like '"+cid+",%' or p.category_id like '%,"+cid+",%'", function(err,result) {
			if(!err){
				cb(null, result);
			}else{
				console.log(err);
				cb(err,null);
			}
		});	  
	  },

	  get_product_by_ids: function(pids, cb) {
		Query.processquery("select * from product p where p.id in ("+pids+")", function(err,result) {
			if(!err){
				cb(null, result);
			}else{
				console.log(err);
				cb(err,null);
			}
		});	  
	  },

	  get_product: function(pid, cb) {
		Query.processquery("select * from product p where p.id in ("+pid+")", function(err,result) {
			if(!err){
				cb(null, result);
			}else{
				console.log(err);
				cb(err,null);
			}
		});	  
	  },

};

module.exports = general;
