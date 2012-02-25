var Zone = require("./zone.js");
var _ = require('underscore');


// var mongoose = require('mongoose');
// var ZoneSchema = new mongoose.Schema({
//   "id" : {"type": String, "index": true},
//   "x" : String,
//   "y" : String
// });
// var ZoneModel = mongoose.model('ZoneModel', ZoneSchema);
var ZoneModel = require('../db/moaSchema').ZoneModel;

var WorldZones = function(callback){
	this.allZones = {};
	//console.log("loading zones");
	return callback(null, this);
	// this.loadFromDB(function(err){		
	// 	return callback(err, this);
	// }.bind(this));
};


WorldZones.prototype.createZone = function(zoneID, callback){
	new Zone(zoneID, function(err, zone){		
		if (err) callback(err);
		this.allZones[zoneID]  = zone;
		console.log("zone saved", this.allZones);
		return callback(null, this.allZones[zoneID]);
	}.bind(this));
}

WorldZones.prototype.getZone = function(zoneID, callback) {
	
	var z = this.allZones[zoneID];
	 console.log("allZones", this.allZones, z);
	if (_.isUndefined(z)) {
		// console.log("create zone");
		return this.createZone(zoneID, callback);
	}
	else{
		//console.log("addZoneAlreadyExists", z);
		return callback(null, z);	
	}
}


WorldZones.prototype.saveToDB = function() {
	for (zID in this.allZones){
		this.allZones[zID].saveToDB();
	}
};

WorldZones.prototype.loadFromDB = function(callback) {
	// var mongoose = require('mongoose');
	// mongoose.connect("mongodb://localhost/moaTest");

	// console.log("load from db ", ZoneModel);
	// var z = new ZoneModel();
	// z.id = "a";
	// z.save(function(err){
	// 	console.log("save", err);
	// });

	ZoneModel.count({}, function(err, count){
		if (err) callback(err);		
		if (count > 0){
			ZoneModel.find({}, function(err, zones){		
//				console.log('find count zones', zones, err);			
					zones.forEach(function(z){
						this.allZones[z.id] = new Zone(z);
					}.bind(this));
	//				console.log('zones loaded from db');	
					return callback(null);
				}.bind(this));			
		} else {
//			console.log('no item');
			return callback(null);				
		}
		//.bind(this)
	});
};


module.exports = WorldZones;