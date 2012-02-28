
var User = require("../../classes/user");
var CONFIG = require("./config");
var common = require("./common");

exports.users = {};

exports.users.createUser = function(callback){
	User.createUser(CONFIG.userInfo.email, CONFIG.userInfo.password, callback);
}

exports.users.subscribeUserOverSocket = function(res, callback){
	res.socket.emit('user-subscribe', {'email': CONFIG.userInfo.email, "password" : CONFIG.userInfo.password}, function(err, u){
		res.user = u;
		callback(err, res);
	});	
}

exports.users.authenticateUser = function(res, callback){
	common.browser.doHTTPPOSTRequest(res, CONFIG.http.authenticateURL, CONFIG.http.options, res.user, function(err, res){
		res.response.on('data', function(body){
			res.body = body;
			callback(null, res);
		});
	});					
}