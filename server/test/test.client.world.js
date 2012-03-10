

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
      function(next){ Zone.createZone(CONFIG.zoneTaine.id, test.done)},
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
  ,"subscribe user over socket, authenticate, get zone" :  function(test){
    Step([
      function(next){ common.users.subscribeUserOverSocketAndAuthenticate({"test" : test}, CONFIG.userInfo, next); },
      function(res, next) {
        res.socket.emit('getZone', CONFIG.zoneTaine.id);
        res.socket.on('zone', function(zone){
          test.ok(zone.ants.length == 0, "zone should be empty ?");
        });
        res.socket.on('inventory', function(inventory){
          test.ok(inventory.err == null);
          test.ok(inventory.ants.length == 1, "inventory should have one ant");
          res.socket.disconnect();
        });
        res.socket.emit("gameLoaded", {});
      }
    ]);
  }
 ,"create user, authenticate, get inventory" :  function(test){
    Step([
      function(next) {common.users.createUser(next)},
      function(next) {common.getSecureSocketFromGame({"test" : test}, next); },
      function(res, next) {common.users.authenticateUser(res, CONFIG.userInfo, next); },
      function(res, next) {
        res.socket.on('inventory', function(inventory){
          test.ok(inventory.err == null);
          test.ok(inventory.ants.length == 1, "inventory should have one ant");
          res.socket.disconnect();
        });
        res.socket.emit("gameLoaded", {});
      }
    ]);
  }
  ,"create zone, add ant, authenticate, get info box" : function(test){
    Step([
      function(next) {common.users.createUser(next)},
      function(user, next) {
        test.user = user;
        Zone.createZone(CONFIG.zoneTaine.id, next)
      },
      function(zone, next) {
        test.zone = zone;
        Ant.createAntFromZone(test.zone, test.user._id, {"x" : 50, "y" : 50}, next);
      },
      function(ant, next) {
        test.ant = ant;
         common.getSecureSocketFromGame({"test": test}, next);
      },
      function(res, next) {
        common.users.authenticateUser(res, CONFIG.userInfo, next);
      },
      function(res, next){
        res.socket.on("ant", function(antMessage){
          //console.log("ANT RECEIVED", antMessage);
          test.ok(antMessage.err == null, antMessage.err);
          test.ok(antMessage.actions.length != 0, "at least one action should be associated");
          res.socket.disconnect();
        });
        //console.log("GET ANT", test.ant._id);
        res.socket.emit("getAnt", test.ant._id);
      }
    ], function(err){
      console.log(err);
      test.ok(err == null);
    });
  }
 ,"subscribe user, move ant to zone" :  function(test){
    Step([
      function(next){ common.users.subscribeUserOverSocketAndAuthenticate({"test" : test}, CONFIG.userInfo, next); },
      function(res, next) {

        res.socket.on('inventory', function(inventoryMessage){
          test.ok(inventoryMessage.err == null, inventoryMessage.err);
          test.ok(inventoryMessage.ants.length == 1, "inventory should have one ant");
          var ant = inventoryMessage.ants[0];
          res.socket.removeAllListeners("inventory");
          res.socket.on('inventory', function(inventoryMessage){
            test.ok(inventoryMessage.err == null, inventoryMessage.err);
            res.socket.on('zone', function(zone){
              test.ok(zone != null, "zone is null");
              test.ok(zone.ants != null, "zone ants is null");
              test.ok(zone.ants.length == 1, "zone ants is not equal to 1");
              test.ok(zone.ants[0]._id == ant._id, "zone ants and inventory ants are not the same");
              res.socket.disconnect();
            });
            res.socket.emit('getZone', CONFIG.zoneTaine.id);
          });
          var emitMessage = {
            "zoneID" : CONFIG.zoneTaine.id,
            "antID": ant._id,
            "position" : ant.position
          };
          res.socket.emit("moveAntFromInventoryToZone", emitMessage, function(err){
            //console.log(err, "error");
            test.ok(err == null, err);
          });
        });
        res.socket.emit("gameLoaded", {});
      }
    ], function(err){
       //console.log(err, "error");
      test.ok(err == null, err);
    });
  }
  ,"subscribe user, move ant to zone then put it back" :  function(test){
    test.done();
    // Step([
    //   function(next){ common.users.subscribeUserOverSocketAndAuthenticate({"test" : test}, CONFIG.userInfo, next); },
    //   function(res, next) {
    //     console.log(res.user);
    //     test.ant = inventory.ants[0];
    //     var emitMessage = {
    //       "zoneID" : CONFIG.zoneTaine.id,
    //       "antID": test.ant,
    //       "position" : {"x" : 50, "y" : 50}
    //     };
    //     test.res = res;
    //     res.socket('moveAntFromInventoryToZone', emitMessage, next);
    //   },
    //   function(next) { res.socket('moveAntFromZoneToInventory', test.ant._id, next);},
    //   function(next){
    //     test.res.socket.on('inventory', function(inventoryMessage){
    //       test.ok(inventoryMessage.err == null);
    //       test.res.socket.disconnect();
    //     });
    //   }
    // ], function(err){
    //   test.ok(err == null);
    // });
  }

});