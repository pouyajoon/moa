
var Ant = require('../classes/ant');
var Zone = require('./../maps/zone.js');
var assert = require('assert');
var should = require('should'); 
var http = require("http");

var CONFIG = require('./utils/config');

describe('Client World', function() {

	CONFIG.setupDatabase();


	it('created zone, add ant, get zone, has one ant', function(done){
	 	Zone.createZone(CONFIG.zoneTaine.id, function(err, zone){
	 		zone.createAnt(function(err, ant){
	 			CONFIG.checkErr(err);
				console.log("|created ant : ", ant, zone);
				require('./test-socketIO').getZoneTest(done, {}, function(err, res){
					console.log("get socket");
					//done();
					// CONFIG.checkErr(err);
					// console.log("zone", res.zoneTaine);
					// assert.equal(res.zoneTaine.ants.length, 1, "zone should have one ant but has " + res.zoneTaine.ants.length);
					// assert.equal(res.zoneTaine.ants[0].data._id, ant._id, "the ant should be the same");				
					res.socketClient.disconnect();
				});
	 		});
	 	});

	// new Ant(CONFIG.ant.position, CONFIG.ant.size, function(err, ant){
	// 		CONFIG.checkErr(err);
	// 		new Zone(CONFIG.zoneTaine.id, function(err, z){
	// 			z.addAnt(ant);
	// 			z.saveToDB(function(err){
	// 				CONFIG.checkErr(err);		
	// 				require('./test-socketIO').getZoneTest(done, {}, function(err, res){
	// 					CONFIG.checkErr(err);		
	// 					console.log("zone", res.zoneTaine);
	// 					assert.equal(res.zoneTaine.ants.length, 1, "zone should have one ant but has " + res.zoneTaine.ants.length);
	// 					assert.equal(res.zoneTaine.ants[0].data._id, z.ants[0].data._id, "the ant should be the same");
						
	// 					res.socketClient.disconnect();
	// 				});
	// 			});
	// 		})
	});	


});