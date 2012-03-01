var Step = require('common').step;
var User = require("../../classes/user");
var CONFIG = require("./config");
var common = require("./common");

exports.users = {};

exports.users.createUser = function(callback){
	User.createUser(CONFIG.userInfo.email, CONFIG.userInfo.password, callback);
}

exports.users.subscribeUserOverSocket = function(res, userInfo, callback){
	res.socket.emit('user-subscribe', userInfo, function(err, u){
		res.user = u;
		callback(err, res);
	});	
}

exports.users.authenticateUser = function(res, userInfo, callback){
	common.browser.doHTTPPOSTRequest(res, CONFIG.http.authenticateURL, CONFIG.http.options, userInfo, function(err, res){
		res.response.on('data', function(body){
			res.body = body;
			callback(null, res);
		});
	});					
}


exports.users.subscribeUserOverSocketAndAuthenticate = function(res, userInfo, callback){
  Step([
    function(next) { common.getSecureSocketFromGame(res, next); },
    function(res, next) { common.users.subscribeUserOverSocket(res, userInfo, next); },
    function(res, next) { common.users.authenticateUser(res, userInfo, callback); }
  ]);  
}