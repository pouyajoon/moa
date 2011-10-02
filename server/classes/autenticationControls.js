
var libAuth = require('./autentication');
var qs = require('querystring');
var lib_Users = require ('./../db/users');

module.exports = function(app){


app.get('/users/login', function(req, res){
	res.render("users/login.jade", {layout:'layout', 'title' : 'Login'});
});



app.get('/users/logout', libAuth.requireLogin, function(req, res) {
	req.session.user = null;
	res.redirect('/');	
});

app.post('/users/authenticate', function(req, res){
	var body = qs.parse(req.rawBody);
	var user = lib_Users.userExists(body.username, body.password, function(user) {		
		if (user) {
			req.session.user = user;
			res.redirect('/');
		} else {
			req.flash('warn', 'wrong username or password');
			res.redirect('/users/login');
		}
	});
});

};

