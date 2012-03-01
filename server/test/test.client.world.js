

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
  // ,"created zone, add ant, get zone, has one ant" : function(test){
  //   Step([
  //     function(next){ Zone.createZone(CONFIG.zoneTaine.id, next)},
  //     function(zone, next) { zone.createAnt(next)},
  //     function(ant, next) {common.zones.getZoneFromSocket({"test" : test}, function(err, res){
  //         test.ok(err == null);
  //         test.ok(ant != null, "ant is null");
  //         test.ok(res.zone != null, "zone is null");
  //         test.ok(res.zone.ants.length == 1, "zone should have one ant");
  //         test.ok(ant._id == res.zone.ants[0], "ant id is wrong");        
  //         res.socket.disconnect();
  //     })}
  //   ]);
  // }
  ,"subscribe user over socket, authenticate, get zone" :  function(test){
    Step([
      function(next){ common.users.subscribeUserOverSocketAndAuthenticate({"test" : test}, CONFIG.userInfo, next); },
      function(res, next) { 
        res.socket.emit('getZone', CONFIG.zoneTaine.id);
        res.socket.on('zone', function(zone){
          test.ok(zone.ants.length == 0, "zone should be empty ?");
          //res.socket.disconnect();  
        });
        res.socket.on('inventory', function(inventory){
          test.ok(inventory.ants.length == 1, "inventory should have one ant");
          //console.log(inventory);
          res.socket.disconnect();  
        });        

        
      }
    ]);

    // common.users.subscribeUserOverSocketAndAuthenticate({"test" : test}, CONFIG.userInfo, function(err, res){
    //   test.ok(err == null);
    //   test.ok(res.user != null, "user is null");
    //   test.ok(res.user.email == CONFIG.userInfo.email);
    //   test.ok(res.user.inventory != null, "user dont have an inventory");


    //   // test.ok(res.user.inventory.ants != null, "user dont have ants in his inventory");      
    //   // test.ok(res.user.inventory.ants.length = 1, "user should have one ant in his inventory");
    //   res.socket.disconnect();
    // });


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
// 				require('./test-socketIO').getZoneTest(done, {}, function(err, res){
// 					//done();
// 					CONFIG.checkErr(err);
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

// 				require('./test-socketIO').getZoneTest(done, {}, function(err, res){

// 					//done();
// 					CONFIG.checkErr(err);

// 					assert.equal(res.zoneTaine.ants.length, 1, "zone should have one ant but has " + res.zoneTaine.ants.length);
// 					assert.notEqual(res.zoneTaine.ants[0]._id, ant._id, "the ant should be the same : " + ant._id + ", " + res.zoneTaine.ants);				
// 					res.socketClient.disconnect();
// 				});
// 	 		});
// 	 	});
// 	});		


// });