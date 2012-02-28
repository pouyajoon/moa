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
    Ant.createAnt(function(err, ant){
      test.ok(err == null);
      test.ok(ant != null, "ant is null");         
      test.done();
    });    
  }
  ,"create ant from zone" : function(test){
    Step([
        function(next) {Zone.createZone(CONFIG.zoneTaine.id, next)},
        function(zone, next){ zone.createAnt(function(err, ant){
          test.ok(err == null);
          test.ok(ant != null, "ant is null");         
          test.done();
        })}
    ]);
  }
});