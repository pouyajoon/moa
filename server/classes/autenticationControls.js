
var libAuth = require('./autentication');
var qs = require('querystring');
var lib_Users = require ('./../db/users');
var md5 = require('crypto').createHash('md5');

module.exports = function(app){


// app.get('/users/login', function(req, res){
// 	res.render("users/login.jade", {layout: false, 'title' : 'Login'});
// });


app.get('/users/logout', libAuth.requireLogin, function(req, res) {
	req.session.user = null;
	res.redirect('/');	
});


var User = require('./user');

app.post('/users/authenticate', function(req, res){
	var body = qs.parse(req.rawBody);

	// md5.update("a");
	// var pwd = md5.digest('hex');

	var u = new User(body.email, "pwd");
//	console.log(a);
	u.existsWithPassword(function(exists){
		if (exists) {
			req.session.user = u;
			res.redirect('/');
		} else {
			req.flash('warn', 'wrong username or password');
			res.redirect('/users/login');
		}
	});
});

};

