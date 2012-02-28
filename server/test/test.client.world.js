

var Step = require('common').step;

var assert = require('assert');
var should = require('should'); 
var Zone = require('../maps/zone');
var Ant = require('../classes/ant');
var common = require('./utils/common');
var CONFIG = require('./utils/config');

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
  ,"created zone, add ant, get zone, has one ant" : function(test){
    Step([
      function(next){ Zone.createZone(CONFIG.zoneTaine.id, next)},
      function(zone, next) { zone.createAnt(next)},
      function(ant, next) {common.zones.getZoneFromSocket({"test" : test}, function(err, res){
          test.ok(err == null);
          test.ok(ant != null, "ant is null");
          test.ok(res.zone != null, "zone is null");
          test.ok(res.zone.ants.length == 1, "zone should have one ant");
          test.ok(ant._id == res.zone.ants[0], "ant id is wrong");        
          res.socket.disconnect();
      })}
    ]);
  }
});
// var Ant = require('../classes/ant');
// var Zone = require('./../maps/zone.js');
// var assert = require('assert');
// var should = require('should'); 
// var http = require("http");

// var CONFIG = require('./utils/config');

// describe('Client World', function() {

// 	CONFIG.setupDatabase();


// 	it('created zone, add ant, get zone, has one ant', function(done){
// 	 	Zone.createZone(CONFIG.zoneTaine.id, function(err, zone){
// 	 		zone.createAnt(function(err, ant){
// 	 			CONFIG.checkErr(err);
// 				//console.log("|created ant : ", ant, zone);
// 				require('./test-socketIO').getZoneTest(done, {}, function(err, res){
// 					//console.log("get socket");
// 					//done();
// 					CONFIG.checkErr(err);
// 					//console.log("zone", res.zoneTaine);
// 					assert.equal(res.zoneTaine.ants.length, 1, "zone should have one ant but has " + res.zoneTaine.ants.length);
// 					assert.notEqual(res.zoneTaine.ants[0]._id, ant._id, "the ant should be the same : " + ant._id + ", " + res.zoneTaine.ants);				
// 					res.socketClient.disconnect();
// 				});
// 	 		});
// 	 	});
// 	});	


// 	it('created zone, add ant, create user, authenticate, get zone, get inventory', function(done){
// 	 	Zone.createZone(CONFIG.zoneTaine.id, function(err, zone){
// 	 		zone.createAnt(function(err, ant){
// 	 			CONFIG.checkErr(err);
// 				//console.log("|created ant : ", ant, zone);
// 				require('./test-socketIO').getZoneTest(done, {}, function(err, res){
// 					//console.log("get socket");
// 					//done();
// 					CONFIG.checkErr(err);
// 					//console.log("zone", res.zoneTaine);
// 					assert.equal(res.zoneTaine.ants.length, 1, "zone should have one ant but has " + res.zoneTaine.ants.length);
// 					assert.notEqual(res.zoneTaine.ants[0]._id, ant._id, "the ant should be the same : " + ant._id + ", " + res.zoneTaine.ants);				
// 					res.socketClient.disconnect();
// 				});
// 	 		});
// 	 	});
// 	});		


// });