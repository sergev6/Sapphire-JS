"use strict";
var cat = require('./category');
var category = function(app) {
	//Category Routes
    app.get('/category',cat.list);
    app.get('/category/all',cat.json_data);
    app.get('/category/add',cat.info,cat.addedit);
    app.get('/category/edit/:id',cat.info,cat.addedit);
    app.post('/category/save', cat.save);
    app.get('/category/delete/:id',cat.del);
};
module.exports = category;