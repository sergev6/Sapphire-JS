"use strict";
var util = require('util');
var ord = require('./order');
var main = require('./../main');

var order = function(app) {
	//Order Routes
    app.get('/order',ord.list);
    app.get('/order/all',ord.json_data);
    app.get('/order/add',ord.info,ord.addedit);
    app.get('/order/edit/:id',ord.info,ord.addedit);
    app.post('/order/save', ord.save);
    app.get('/order/delete/:id',ord.del);
};

module.exports = order;