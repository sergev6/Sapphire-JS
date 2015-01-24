"use strict";
var main = require('./main');
module.exports = function (app) {
  app.get('/',main.dashboard);
  app.get('/login/',function(req, res){res.render('login.ejs',{title:'Login Page'});});
  app.get('/logout',function(req, res){req.session.adminuser = null; res.redirect('/');});
  app.post('/login/',main.login);
  //module list
  require('./category')(app);  
  require('./manufacturer')(app); 
  require('./product')(app);
  require('./order')(app); 
  require('./page')(app); 
  require('./users')(app); 
};