
var Step = require('common').step;
var Server = require('./../lib/Server.js');
var assert = require('assert');
var common = require('./utils/common');

var should = require('should'); 
var io = require("socket.io-client");
var CONFIG = require('./utils/config');


var testCase = require('nodeunit').testCase;

module.exports = testCase({

  "setUp": function(callback) {
  	Step([
  		function(next){CONFIG.setUp(callback)}  		
  	], callback);
  },

  "tearDown": function(callback) {
  	CONFIG.tearDown(callback);
  }

  ,"get 2 page, check session is same" : function(test){
    Step([
      function(next) { common.getSecureSocketFromGame({"test" : test}, next); },
      function(res, next) {  common.browser.doHTTPGETRequest(res, CONFIG.http.sessionUrl, CONFIG.http.options, next); },
      function(res, next) {  
        test.ok(res.cookies["session.id"] != null, "session id is not set");
        var firstSessionID = res.cookies["session.id"];
        common.browser.doHTTPGETRequest(res, CONFIG.http.sessionUrl, CONFIG.http.options, function(err, res){
          test.ok(firstSessionID == res.cookies["session.id"], "cookies have changed between two requests : "+ firstSessionID + " != " + res.cookies["session.id"]);
          //console.log(res.response.session);
          res.socket.disconnect();
        });
      }
    ]);  
  }

  ,"get secure socket client from game" : function(test){
		common.getSecureSocketFromGame({"test" : test}, function(err, res){
			test.ok(err == null);
			test.ok(res != null);
			res.socket.disconnect();
		});
  }
  ,"get zone test" : function(test){
		common.zones.getZoneFromSocket({"test" : test}, function(err, res){
      test.ok(res.zone != null, "zone is null");
      test.ok(res.zone.id == CONFIG.zoneTaine.id, 'wrong zone id');
      res.socket.disconnect();          
    });
	}

});

