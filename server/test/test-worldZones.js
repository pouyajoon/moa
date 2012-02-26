
var WorldZones = require('../maps/zones');
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

});



exports.createZoneRueTaine = function(res, callback){
	new WorldZones(function(err, _worldZone){
		CONFIG.checkErr(err);
		should.exist(_worldZone, "worldZones is null");
		res.worldZone = _worldZone;
		_worldZone.createZone(CONFIG.zoneTaine.id, function(err, z){
			CONFIG.checkErr(err);
			assert.equal(z.id, CONFIG.zoneTaine.id, 'zone id is wrong');
			res.zone = z;
			return callback(err, res);
		});
	});
}
