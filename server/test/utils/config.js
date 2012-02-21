exports.serverConfiguration = {
	"options" : {
	    "port" : 3000,
	    "paths" : []
	},
	"host" : "pouya"
};

exports.zoneTaine = {
	"id" : "1062511_721645"
};


exports.http = {
	"sessionUrl" : '/users/login',
	"options" : {'host': exports.serverConfiguration.options.host}
}

var assert = require('assert');

exports.checkErr = function(err){
	assert.equal(err, null, "error is not equal to null :"  + err);
}
