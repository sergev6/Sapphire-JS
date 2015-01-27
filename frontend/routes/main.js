var general = require('./../model/general');
var category = require('./../model/category');
var util = require('util');

var main = {

	get_header: function(req, cb) {
		var output = '';
		var querystring = req.url.split('?');
		var found = 0;
		var breadcrumb = [];
		var rparam = [];


		breadcrumb[0] = '<a class="menu-item menu-sub-menu md-menu-item" md-ink-ripple="#bbb" href="/">Home</a>';
		category.by_id("", function(err, result) {
			if (!err) {
				querystring = querystring[0].replace('/','',querystring[0]);
				for(var x in result) {
					if (result[x].url_key == querystring) {
						output += '<li class="active"><a class="menu-item menu-sub-menu md-menu-item" md-ink-ripple="#bbb" href="/' + result[x].url_key + '"><i id="ic"></i>' + result[x].name + '</a></li>';
						breadcrumb[1] = result[x].name;
						found = 1;
					} else {
						output += '<li class=""><a class="menu-item menu-sub-menu md-menu-item" md-ink-ripple="#bbb" href="/' + result[x].url_key + '"><i id="ic"></i>' + result[x].name + '</a></li>';
					}
				}
			}
			output = '<li><a href="/"><i id="ic"></i>Home</a><li>' + output;
			rparam[0] = output;
			rparam[1] = breadcrumb;
			cb(rparam);
		});
	},

	homepage: function (req, res) {
		main.get_header(req, function(output) {
			res.render(
				'index.ejs',
				{title:'Nodecart', header:output[0]}
			);
		});
	},

	transfer: function (req, res) {
      if(req.params.otherparam){
		general.get_url_value(req.params.otherparam, function(err, url_value) {
			console.log("get of :"+url_value);
			if (url_value && url_value.match('category/'))
			{
				var cid = url_value.split('category/');
				main.productlist(req, res, cid[1]);
			} else if(url_value && url_value.match('product/')) {
				var pid = url_value.split('product/');
				main.productview(req, res, pid[1]);
			} else {
			  res.redirect('/',301);
			}
		});
      }
	},

	productlist: function(req, res, cid) {
		var catid = '';
		if (req.params.catid) {
			catid = req.params.catid;
		} else if (cid) {
			catid = cid;
		}
		if (catid) {
			main.get_header(req, function(output) {
				general.get_product_list(catid, function(err, productlist) {
				   res.render('productlist.ejs',
							{title:'Product list', productlist: (productlist.length)?productlist:'', header:output[0], bcrum:output[1]}
				   );
				});
			});
		} else {
			res.redirect('/');
		}
	},

	productview: function(req, res, xpid) {
		var pid = '';
		if (req.params.pid) {
			pid = req.params.pid;
		} else if (xpid) {
			pid = xpid;
		}
		if (pid) {
			main.get_header(req, function(output) {
				general.get_product(pid, function(err, productdata) {
				   output[1][1] = productdata[0].name;
				   res.render('productview.ejs',
							{title:'Product Detail', productdata: (productdata[0])?productdata[0]:'', header:output[0], bcrum:output[1]}
				   );
				});
			});
		} else {
			res.redirect('/');
		}
	},

	addtocart : function (req, res) {
		var pid = '';
		var found = 0;
		if (req.params.pid) {
			if (!req.session.cart) {
				req.session.cart = [];
			}
			pid = req.params.pid;
			for(var x in req.session.cart) {
				var sess = req.session.cart[x];
				if (pid == sess.pid) {
					sess.qty = sess.qty + 1;
					req.session.cart[x] = sess;
					found = 1;
					break;
				}
			}
			if (!found) {
			  var sess = new Object();
			  sess.pid = pid;
			  sess.qty = 1;
			  main.getfinalprice(pid, function(price) {
				sess.price = price;
				req.session.cart[req.session.cart.length] = sess;
				res.redirect('/cart/view');
			  });
			} else {
				res.redirect('/cart/view');
			}
		} else {
			res.redirect('/');
		}
	},

	getfinalprice : function(pid, cb) {
		general.get_product_by_ids(pid, function(err,result) {
			if (!err && result) {
			  // add login for final price of the product
			  cb(result[0].price);
			} else {
			  cb(null);
			}
		});
	},

	viewcart : function (req, res) {
		main.get_header(req, function(output) {
				req.session.cartqty = [];
				var getids = '';
				output[1][1] = 'Cart';
				if (req.session.cart) {
					for(var x in req.session.cart) {
						if (req.session.cart[x].pid && req.session.cart[x].pid > 0) {
						 getids = getids + "'" +  req.session.cart[x].pid + "',";
						 req.session.cartqty[req.session.cart[x].pid] = new Object();
						 req.session.cartqty[req.session.cart[x].pid] = req.session.cart[x];
						}
					}
				}
				if (getids) {
					getids = getids.substring(0, getids.length - 1);
					general.get_product_by_ids(getids, function(err, productlist) {
							res.render('viewcart.ejs',
								{title:'Cart', productlist: productlist, header:output[0], bcrum:output[1]}
							);
					});
				} else {
					res.render('viewcart.ejs',
						{title:'Cart', productlist: '', header:output[0], bcrum:output[1]}
					);
				}

		});
	},

	checkout : function (req, res) {
		main.get_header(req, function(output) {
				req.session.cartqty = [];
				var getids = '';
				output[1][1] = 'Checkout';
				if (req.session.cart && req.session.cart.length > 0) {
					res.render('checkout.ejs',
						{title:'Checkout', header:output[0], bcrum:output[1]}
					);
				} else {
					res.redirect('/cart/view');
				}
		});
	},

	placeorder : function (req, res) {
		if (req.session.cart && req.session.cart.length > 0) {
			var order = require('./../model/order');
			require('date-utils');
			var d = Date.today();
			var products = '';
			var orderamt = 0;
			for(var x in req.session.cart) {
				var sess = req.session.cart[x];
				products = products + sess.pid + '|' + sess.qty + '|' + sess.price + '#';
				orderamt = orderamt + (sess.qty*sess.price);
			}
			var data = {
	    		firstname:req.body.firstname,
				lastname:req.body.lastname,
				email:req.body.email,
				company:req.body.company,
				address1:req.body.address1,
				address2:req.body.address2,
				city:req.body.city,
				state:req.body.state,
				country:req.body.country,
				zipcode:req.body.zipcode,
				telephone:req.body.telephone,
				fax:req.body.fax,
				sfirstname:req.body.sfirstname,
				slastname:req.body.slastname,
				semail:req.body.semail,
				scompany:req.body.scompany,
				saddress1:req.body.saddress1,
				saddress2:req.body.saddress2,
				scity:req.body.scity,
				sstate:req.body.sstate,
				scountry:req.body.scountry,
				szipcode:req.body.szipcode,
				stelephone:req.body.stelephone,
				sfax:req.body.sfax,
				products:products,
				paymentmethod:req.body.paymentmethod,
				status:'pending',
	    		orderamt:orderamt,
				currency: 'dollar',
				discount: 0,
				tax: 0,
				shipping: 0
	    	};
			data.orderdate=d.toFormat('YYYY-MM-DD HH:MI:SS');
			order.save(data, function(err, output) {
				if (!err) {
					res.redirect('/thankyou');
				}
			});
			//place your code for creating order
		} else {
			res.redirect('/');
		}
	},

	thankyou: function (req, res) {
		main.get_header(req, function(output) {
				output[1][1] = 'Thank You';
				req.session.cart = [];
				res.render('thankyou.ejs',
					{title:'Thank You', header:output[0], bcrum:output[1]}
				);
		});
	},

	removecart: function (req, res) {
		var pid = '';
		var found = 0;
		if (req.params.pid) {
			if (!req.session.cart) {
				req.session.cart = [];
			}
			pid = req.params.pid;
			for(var x in req.session.cart) {
				var sess = req.session.cart[x];
				if (pid == sess.pid) {
					req.session.cart.splice(x, 1);
					break;
				}
			}
			res.redirect('/cart/view');
		} else {
			res.redirect('/');
		}
	},

	updatecart: function (req, res) {
		var pid = '';
		var qty = '';
		var found = 0;
		if (req.params.pid) {
			if (!req.session.cart) {
				req.session.cart = [];
			}
			pid = req.params.pid;
			qty = req.params.qty;
			for(var x in req.session.cart) {
				var sess = req.session.cart[x];
				if (pid == sess.pid) {
					if (qty > 0) {
					  sess.qty = parseInt(qty);
					  req.session.cart[x] = sess;
					  found = 1;
					}
					break;
				}
			}
			res.redirect('/cart/view');
		} else {
			res.redirect('/');
		}
	},

	aboutus: function (req, res) {
		main.get_header(req, function(output) {
				output[1][1] = 'About Us';
				req.session.cart = [];
				res.render('aboutus.ejs',
					{title:'About us', header:output[0], bcrum:output[1]}
				);
		});
	},
	
	contactus: function (req, res) {
		main.get_header(req, function(output) {
				output[1][1] = 'Contact Us';
				req.session.cart = [];
				res.render('contactus.ejs',
					{title:'Contact Us', header:output[0], bcrum:output[1]}
				);
		});
	}




};

module.exports = main;
