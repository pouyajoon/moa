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

exports.ant = {
	"position" : {"x" : 500, "y" : 500}
	, "size" :  {"x" : 50, "y" : 50}
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

exports.setupDatabase = function(test){
	var db;

	beforeEach(function(){		
		// console.log('start');
		db = require('./db').loadDB();
		require('./db').clearDB();
	});

	afterEach(function(){
		// console.log('end');
		//require('./db').closeDB(db);

	});

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