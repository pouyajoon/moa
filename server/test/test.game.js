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
  },

  "tearDown": function(callback) {
  	CONFIG.tearDown(callback);
  },
  "start server" : function(test){
    test.expect(2);
    common.createServer({}, function(err, res){      
      test.ok(err == null);
      test.ok(res.server != null, 'server is null');
      res.server.close();
      test.done();
    });
  }
  ,"start game" : function(test){
    test.expect(3);
    common.createGame({}, function(err, res){  
      test.ok(err == null);
      test.ok(res.game != null, "game is null");
      test.ok(res.game.worldZones != null, "world zone is null");
      res.game.close();
      test.done();        
    });
  }
  ,"check routes /users/login" : function(test){
     checkRoute(test, "/users/login");
  }
  ,"check routes /" : function(test){
     checkRoute(test, "/");
  }  
  ,"get http page" : function(test){
     checkRoute(test, "/");
  }
  ,"get http session id from cookie" : function(test){
    common.getHTTPPage({}, function(err, res){
      test.ok(err == null);
      should.exist(res.cookies["session.id"], "session id should be set in cookies");      
      res.game.close();
      test.done();       
    });    
  }
  ,"get http page cookies mandatory" : function(test){
    common.getHTTPPage({}, function(err, res){
      test.ok(err == null);
      test.ok(res.cookies != null, "cookies is null");   
      res.game.close(); 
      test.done();       
    });    
  }
  ,"create world zones" : function(test){
    new WorldZones(function(err){
      test.ok(err == null);
      test.done();
    });
  }

  ,"create zone" : function(test){
     common.zones.createZoneRueTaine({}, function(err, res){
      test.ok(err == null);
      test.done();
    });   
  }

  ,"get zone local" : function(test){
    new WorldZones(function(err, _worldZone){
      CONFIG.checkErr(test, err);
      _worldZone.getZone(CONFIG.zoneTaine.id, function(err, z){
        test.ok(err == null);
        test.equal(z.id, CONFIG.zoneTaine.id, 'zone id is wrong');
        test.done();
      });     
    });   
  } 
  ,"get zone local from game with zone already existing" : function(test){
    Step([
        function(next){ Zone.createZone(CONFIG.zoneTaine.id, next)},
        function(zone, next) {common.zones.getZoneFromSocket({"test" : test}, function(err, res){
          test.ok(zone != null, "zone is null");
          test.ok(zone.id == CONFIG.zoneTaine.id, 'wrong zone id');
          res.socket.disconnect();          
        })}
    ]);
  }
  ,"get http page from server" : function(test){
    common.getHTTPPageFromServer({}, function(err, res){
      test.ok(err == null);
      test.ok(res != null, "res is null");   
      res.server.close();     
      test.done();
    });
  }
});

function checkRoute(test, _route){
  test.expect(2);
  common.getHTTPPage({}, function(err, res){
    test.ok(err == null);
    res.response.on('data', function(chunk) {
      test.equal(chunk.indexOf("Cannot GET " + _route), -1, "Cannot GET " + _route + " !!!");
      res.game.close();
      test.done();
    });       
  });
}







