
var WorldZones = require('../maps/zones');
var assert = require('assert');


var CONFIG = require('./utils/config');

describe('WorldZones', function() {


	beforeEach(function(){
		this.db = require('./utils/db').loadDB();
		require('./utils/db').clearDB();
	});

	afterEach(function(){
		require('./utils/db').closeDB(this.db);
	});


	it('create zones empty', function(done) {		
		new WorldZones(function(err){
			CONFIG.checkErr(err);			
			done();
		});
  });

	it('create zone', function(done) {	
		new WorldZones(function(err, _worldZone){
			_worldZone.createZone(CONFIG.zoneTaine.id, function(err, z){
				CONFIG.checkErr(err);
				done();
			});
		});
  });  

});
