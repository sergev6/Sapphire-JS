var express		    = require('express');
var app				= express.createServer();
var config			= require('./config/admin');
var util			= require('util');
var main			= require('./routes/admin/main');
var uploadsLocalUrl = '/media';
var uploadsPath		= 'media';
app.configure(function(){
  app.use(express.static(__dirname + '/public/admin'));
  require('./lib/admin')(app);   // view settings
  app.set('views', __dirname + '/views/admin');
  app.use(uploadsLocalUrl, express.static(uploadsPath));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret:"asd43g84webe88d38",store:''}));
});
app.use(main.auth);
require('./routes/admin')(app);
console.log("Server listening on port " + config.port + " url : " + config.host + ":" + config.port);
app.listen(config.port);

/*-=============================================================================================*/
/*app.dynamicHelpers({
  checkIndex: function(str,checkfor) {
    //var f = str.indexOf(checkfor);
	return 2;
  }
});*/
