"use strict";
var util = require('util');
var manu = require('./manufacturer');
var main = require('./../main');

var manufacturer = function(app) {
	//Category Routes
    app.get('/manufacturer',manu.list);
    app.get('/manufacturer/all',manu.json_data);
    app.get('/manufacturer/add',manu.info,manu.addedit);
    app.get('/manufacturer/edit/:id',manu.info,manu.addedit);
    app.post('/manufacturer/save', manu.save);
    app.get('/manufacturer/delete/:id',manu.del);
};

module.exports = manufacturer;