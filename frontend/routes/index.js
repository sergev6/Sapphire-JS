"use strict";
var util = require('util');
var main = require('./main');
module.exports = function (app) {
  app.get('/', main.homepage);
  app.get('/category/:catid', main.productlist);
  app.get('/cart/add/:pid', main.addtocart);
  app.get('/cart/remove/:pid', main.removecart);	
  app.get('/cart/update/:pid/:qty', main.updatecart);	
  app.get('/cart/view', main.viewcart);	
  app.get('/checkout', main.checkout);	
  app.get('/thankyou', main.thankyou);	
  app.get('/contactus', main.contactus);
  app.get('/aboutus', main.aboutus);
  app.get('/:otherparam', main.transfer);
  app.post('/placeorder', main.placeorder);
  require('./user')(app);  
};