
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
  ,"get secure socket client from game" : function(test){
		common.getSecureSocketFromGame({"test" : test}, function(err, res){
			test.ok(err == null);
			test.ok(res != null);
			res.socket.disconnect();
		});
  }
 //  ,"get zone test" : function(test){
	// 	common.zones.getZoneFromSocket({"test" : test}, function(err, res){
 //      test.ok(res.zone != null, "zone is null");
 //      test.ok(res.zone.id == CONFIG.zoneTaine.id, 'wrong zone id');
 //      res.socket.disconnect();          
 //    });
	// }

});


// describe('Socket.io', function() {

// 	CONFIG.setupDatabase();

// 	it('get secure socket client from server', function(done){
// 		CONFIG.repeat(0, 0, done, getSecureSocketFromServerTest);
// 	});

// 	it('get secure socket client from server 150 times', function(done){
// 		CONFIG.repeat(0, 150, done, getSecureSocketFromServerTest);
// 	});

// 	it('get secure socket client from game', function(done){
// 		CONFIG.repeat(0, 0, done, getSecureSocketFromGameTest);
// 	});

// 	it('get secure socket client from game 100 times', function(done){
// 		CONFIG.repeat(0, 100, done, getSecureSocketFromGameTest);
// 	});



// 	it('socket get zone', function(done){
// 		exports.getZoneTest(done, {}, function(err, res){
// 			res.socketClient.disconnect();
// 		});
// 	});	

// 	it('get zone with zone already existing in base', function(done){
// 		require('./test-worldZones').createZoneRueTaine({}, function(err, res){
// 			CONFIG.checkErr(err);
// 			//console.log("res1", res);
// 			exports.getZoneTest(done, res, function(err, res){
// 				//console.log("res2", res);
// 				assert.equal(res.zoneTaine._id, res.zone._id, "zone id should be the same");
// 				res.socketClient.disconnect();
// 			});
// 		});
// 	});

// });


// exports.getZoneTest = function(done, res, callback){
// 	//console.log('getZoneTest');
// 	exports.getSecureSocketFromGame(res, function(err, res){
// 		//console.log('getSecureSocketFromGame');
// 		CONFIG.checkErr(err);		
// 		res.socketClient.emit('getZone', CONFIG.zoneTaine.id);
// 		res.socketClient.on('zone', function(zone){
// 			res.zoneTaine = zone;
// 			should.exist(zone, "zone should exist");
// //				console.log("get zone", zone);
// 			assert.equal(zone.id, CONFIG.zoneTaine.id, 'wrong zone id');
// 			return callback(err, res);
// 		});
// 	}, function(err, res){
// 		CONFIG.checkErr(err);
// 		res.server.close();
// 		done();
// 	});	
// }
