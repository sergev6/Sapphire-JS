"use strict";
var util = require('util');
var main = require('./../main');
var user = require('./user');

module.exports = function(app) {
    app.get('/user/myaccount', user.render);
    app.get('/user/logout', user.logout);
    app.get('/user/register', user.registerform);
    app.get('/user/login', user.loginform);
    app.post('/user/login', user.login);
    app.post('/user/register', user.register);
};
