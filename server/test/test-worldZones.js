
var WorldZones = require('../maps/zones');
var Zone = require('../maps/zone');
var assert = require('assert');
var should = require('should'); 

var CONFIG = require('./utils/config');

describe('WorldZones', function() {

	CONFIG.setupDatabase();

	it('create world zones', function(done) {		
		new WorldZones(function(err){
			CONFIG.checkErr(err);			
			done();
		});
  });

	it('create zone', function(done) {	
		exports.createZoneRueTaine({}, function(err, res){
			CONFIG.checkErr(err);
			done();
		});
  });

	it('get zone local', function(done) {	
		new WorldZones(function(err, _worldZone){
			CONFIG.checkErr(err);
			_worldZone.getZone(CONFIG.zoneTaine.id, function(err, z){
				console.log(z);
				assert.equal(z.id, CONFIG.zoneTaine.id, 'zone id is wrong');
				done();
			});			
		});		
  });

	it('get zone local from game with zone already existing', function(done) {	
		Zone.createZone(CONFIG.zoneTaine.id, function(err, zone){
			CONFIG.checkErr(err);

			require('./test.game').setupGame({}, CONFIG.serverConfiguration.options, function(err, res){
				console.log("WORLD ZONES : ", res.game.worldZones);
				CONFIG.checkErr(err);
				// res.game.worldZones.getZone(CONFIG.zoneTaine.id, function(err, gamezone){
				// 	console.log(gamezone);
				// 	CONFIG.checkErr(err);
				// 	assert.notEqual(gamezone._id, zone._id, "zone id is wrong :"+ gamezone._id + ", " + zone._id);
				res.game.close();
				done();
				// });
			});
		});	
  });  

});



exports.createZoneRueTaine = function(res, callback){
	new WorldZones(function(err, _worldZone){
		CONFIG.checkErr(err);
		should.exist(_worldZone, "worldZones is null");
		res.worldZone = _worldZone;
		_worldZone.createZone(CONFIG.zoneTaine.id, function(err, z){
			CONFIG.checkErr(err);
			assert.equal(z.id, CONFIG.zoneTaine.id, 'zone id is wrong : ' + z);
			res.zone = z;
			return callback(err, res);
		});
	});
}
