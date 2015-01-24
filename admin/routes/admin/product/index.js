"use strict";
var util = require('util');
var prod = require('./product');
var main = require('./../main');

var product = function(app) {
	//Product Routes
    app.get('/product',prod.list);
    app.get('/product/all',prod.json_data);
    app.get('/product/add',prod.info,prod.addedit);
    app.get('/product/edit/:id',prod.info,prod.addedit);
    app.post('/product/save', prod.save);
    app.get('/product/delete/:id',prod.del);
};

module.exports = product;