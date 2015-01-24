var Db = require('./model.js');
var util = require('util');
var Query = require('./sql');

var general = {
      

	  get_user_count: function(cb) {
		Query.processquery("select count(*) as ucount from user where user_type='Registered' and email_id!='null'", function(err,result) {
			if(!err){
				if (result[0]) {
					cb(result[0].ucount);
				} else {
					cb(0);
				}
			}else{
				cb(0);
			}
		});	  
	  },

	  get_order_count: function(cb) {
		Query.processquery("select count(*) as ocount,sum(orderamt) as totalsales from product_order", function(err,result) {
			if(!err){
				if (result[0]) {
					cb(result[0]);
				} else {
					cb(0);
				}
			}else{
				cb(0);
			}
		});	  
	  },

	  get_today_earning: function(cb) {
		require('date-utils');
		var d = Date.today(); 
		var today = d.toFormat('YYYY-MM-DD');
		Query.processquery("select sum(orderamt) as todayearning from product_order where orderdate like '"+today+"%'", function(err,result) {
			if(!err){
				if (result[0]) {
					cb(result[0].todayearning);
				} else {
					cb(0);
				}
			}else{
				cb(0);
			}
		});	  
	  },	

	  get_month_earning: function(cb) {
		require('date-utils');
		var d = Date.today(); 
		var currentmonth = d.toFormat('YYYY-MM');
		var monthname = d.toFormat('MMM');
		var returnout = {};
		Query.processquery("select sum(orderamt) as monthearning from product_order where orderdate like '"+currentmonth+"%'", function(err,result) {
			if(!err){
				if (result[0]) {
					returnout.monthearning = result[0].monthearning;
					returnout.monthname = monthname;
					cb(returnout);
				} else {
					cb(0);
				}
			}else{
				cb(0);
			}
		});	  
	  },	

	  get_order_product_count: function(cb) {

		var orderdata = {};
		orderdata.sales = 0;
		orderdata.graph = [];
		orderdata.graph[1] = 0;
		orderdata.graph[2] = 0;
		orderdata.graph[3] = 0;
		orderdata.graph[4] = 0;
		orderdata.graph[5] = 0;
		orderdata.graph[6] = 0;
		orderdata.graph[7] = 0;
		orderdata.graph[8] = 0;
		orderdata.graph[9] = 0;
		orderdata.graph[10] = 0;
		orderdata.graph[11] = 0;
		orderdata.graph[12] = 0;
	
		var graph = [];
		var sum = 0;
		var act = 0;	
		Query.processquery("select * from product_order", function(err,result) {
			if(!err){
				if (result[0]) {
					for(i=0; i<result.length; i++) {
						var ordate = result[i].orderdate.getMonth(); 
						ordate = ordate + 1;
						var amt = result[i].orderamt;
						orderdata.graph[ordate] = parseFloat(orderdata.graph[ordate]) + parseFloat(amt);
						var prgroup = result[i].products.split('#');
						if (prgroup) {
							for(j=0; j<prgroup.length; j++) {
								var acgroup = prgroup[j].split('|');
								if (acgroup[0] && acgroup[1])
								{
									sum = sum + (acgroup[0]*acgroup[1]);
								}
							}
						}
					}
					orderdata.sales = sum;
					console.log(orderdata.graph);
					cb(orderdata);
				} else {
					cb(orderdata);
				}	
			}else{
				cb(orderdata);
			}
		});	  
	  },	

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
