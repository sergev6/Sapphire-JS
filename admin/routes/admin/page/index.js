"use strict";
var util = require('util');
var pagem = require('./page');
var main = require('./../main');

var page = function(app) {
	//Page Routes
    app.get('/page',pagem.list);
    app.get('/page/all',pagem.json_data);
    app.get('/page/add',pagem.info,pagem.addedit);
    app.get('/page/edit/:id',pagem.info,pagem.addedit);
    app.post('/page/save', pagem.save);
    app.get('/page/delete/:id',pagem.del);
};

module.exports = page;