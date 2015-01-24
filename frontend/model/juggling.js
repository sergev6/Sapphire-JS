var table = 'category';
var Db = require('./model.js');
var util = require('util');
var Query = require('./sql');

var config = require('../config/config').db_options;
var Schema = require('jugglingdb').Schema;
var schema = new Schema('mysql', {host:config.host,port:config.port,database:config.database,username:config.user,password:config.password}); 
var mcat = schema.define('category', {
	name: {type: String, length: 255 },
    description: {type: Schema.Text },
    is_active: {type: Boolean },
    parent_id: { type:Number},
});

var category = {
      
	  by_id : function(ids,callback){
    	if (ids) {
			var conditions = {where:{id:ids}};
		}
		mcat.all(conditions, function(err,result){
			if(!err){
				callback(null,result);
			}else{
				console.log(err);
				callback(err,null);
			}
		});

		/*var filter = {'id':ids};
	    Query.select(filter,table,function(err,result){
			if(!err){
				callback(null,result);
			}else{
				console.log(err);
				callback(err,null);
			}
		});*/
      },
      
	  save : function(data,callback){
    	  if (data.id) {
			Query.update(data,table,'id',function(err,result){
      		if(!err){
      			callback(null,result);
      		}else{
      			console.log(err);
      			callback(null,err);
      		}
      		});
		  } else {
			Query.insert(data,table,function(err,result){
        		if(!err){
        			callback(null,result);
        		}else{
        			console.log(err);
        			callback(null,err);
        		}
        	});
		  }
      },
   
      del : function(data,callback){
      	  Query.remove(data,table,function(err,result){
      		if(!err){
      			callback(null,result);
      		}else{
      			console.log(err);
      			callback(null,err);
      		}
      	});
      }
    
};

module.exports = category;
