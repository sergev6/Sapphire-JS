var table = 'manufacturer';
var Db = require('./model.js');
var util = require('util');
var Query = require('./sql');

var mmodel = {
      
	  by_id : function(ids,callback){
		var filter = {'id':ids};
	    Query.select(filter,table,function(err,result){
			if(!err){
				callback(null,result);
			}else{
				console.log(err);
				callback(err,null);
			}
		});
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

module.exports = mmodel;
