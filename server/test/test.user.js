var Step = require('common').step;

var assert = require('assert');
var should = require('should'); 
var Zone = require('../maps/zone');
var Ant = require('../classes/ant');
var common = require('./utils/common');
var CONFIG = require('./utils/config');

var moaSchema = require("../db/moaSchema");
var UserModel = moaSchema.UserModel;
var User = require('../classes/user');

var WorldZones = require('./../maps/zones');

var testCase = require('nodeunit').testCase;

module.exports = testCase({

  "setUp": function(callback) {
  	Step([
  		function(next){CONFIG.setUp(callback)}  		
  	], callback);
  }
  ,"tearDown": function(callback) {
  	CONFIG.tearDown(callback);
  }
  ,"create user" : function(test){
  	common.users.createUser(function(err, user){
  		test.ok(err == null);
  		test.ok(user != null, "user is null");
  		test.ok(user.email == CONFIG.userInfo.email);
  		user.hasOne({"email" : CONFIG.userInfo.email, "password" : CONFIG.userInfo.password}, test.done);   		
  	})
  }
  ,"create user, already exists" : function(test){
  	Step([
  		function(next){common.users.createUser(next)},
  		function(next){common.users.createUser(function(err, user){
  			test.ok(err != null);
  			test.ok(err.code == "11000", 'error code is not correct');
  			test.done();
  		})},
  	]);
  }
  ,"subscribe user over socket" :  function(test){
  	Step([
  		function(next) { common.getSecureSocketFromGame({"test" : test}, next)},
  		function(res, next) { common.users.subscribeUserOverSocket(res, CONFIG.userInfo, function(err, res){
	  		test.ok(err == null);
	  		test.ok(res.user != null, "user is null");
	  		test.ok(res.user.email == CONFIG.userInfo.email);
	  		res.socket.disconnect();
  		})}
  	]);
  }
  ,"subscribe user over socket and authenticate" :  function(test){
    common.users.subscribeUserOverSocketAndAuthenticate({"test" : test}, CONFIG.userInfo, function(err, res){
      test.ok(err == null);
      test.ok(res.user != null, "user is null");
      test.ok(res.user.email == CONFIG.userInfo.email);
      test.ok(res.user.inventory != null, "user dont have an inventory");
      res.socket.disconnect();
    });
  }  
});
