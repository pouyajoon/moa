
var Ant = require('../classes/ant');
var Zone = require('./../maps/zone.js');
var assert = require('assert');
var should = require('should'); 
var http = require("http");

var CONFIG = require('./utils/config');

describe('Client World', function() {

	CONFIG.setupDatabase();

	it('create ant', function(done){
		Ant.createAnt(function(err, ant){
			CONFIG.checkErr(err);
			assert.notEqual(ant, null, "ant should not equal to null");
			done();
		});
	});	

	it('create ant from zone', function(done){
	 	Zone.createZone(CONFIG.zoneTaine.id, function(err, zone){
	 		zone.createAnt(function(err, ant){
	 			CONFIG.checkErr(err);
	 			assert.notEqual(zone.ants[0], ant._id, "ant id is wrong");
				//console.log("created ant : ", ant, zone);
				done();
	 		});
		});
	});	

});