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
	"authenticateURL" : "/users/authenticate",
	"options" : {'host': exports.serverConfiguration.host}
}

exports.userInfo = {
	"email" : "pouyajoon@gmail.com", 
	"password" : "test"
}

exports.socketIO = {
	"options" : {'force new connection': true}
}

var assert = require('assert');

exports.checkErr = function(err){
	assert.equal(err, null, "error is not equal to null :"  + err);
}


exports.setIntervalX = function(delay, repetitions, callback) {
    var x = 0;
    var intervalID = window.setInterval(function () {
       callback();
       if (++x === repetitions) {
       		delay /= 2;
          window.clearInterval(intervalID);
       }
    }, delay);
}

exports.repeat = function(currentNumber, maxNumber, onFinish, f){
	if (currentNumber > maxNumber){
		return onFinish();
	} else {
		return f(currentNumber + 1, maxNumber, onFinish, f);
	}
}


Function.prototype.repeat = function(number, done){
	exports.repeat(0, number, done, this);
}