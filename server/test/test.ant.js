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
  ,"create ant" : function(test){
    common.users.createUser(function(err, user){
      test.ok(err == null);

      Ant.createAnt(user._id, function(err, ant){
        test.ok(err == null);
        test.ok(ant != null, "ant is null");
        console.log(ant, user);
        test.ok(ant._user == user._id, "ant should belongs to the user created");
        test.done();
      });
    });

  }
  ,"create ant from zone" : function(test){
    Step([
        function(next) {common.users.createUser(next);},
        function(_user, next) {
          test.user = _user;
          Zone.createZone(CONFIG.zoneTaine.id, next)},
        function(zone, next){ Ant.createAntFromZone(zone, test.user._id, {"x" : 50, "y" : 50}, function(err, ant){
          test.ok(err == null);
          test.ok(ant != null, "ant is null");
          test.done();
        })}
    ]);
  }
});