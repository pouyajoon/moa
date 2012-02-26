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
	//return callback(null, this);
	this.loadFromDB(function(err){		
		return callback(err, this);
	}.bind(this));
};


WorldZones.prototype.createZone = function(_zoneID, callback){

	Zone.createZone(_zoneID, function(err, zone){
		if (err) callback(err);
		this.allZones[_zoneID]  = zone;
		return callback(null, this.allZones[_zoneID]);
	}.bind(this));

	// new Zone(zoneID, function(err, zone){		
	// 	if (err) callback(err);
	// 	this.allZones[zoneID]  = zone;
	// 	//console.log("zone saved", this.allZones);
	// 	return callback(null, this.allZones[zoneID]);
	// }.bind(this));
}

WorldZones.prototype.getZone = function(zoneID, callback) {
	
	var z = this.allZones[zoneID];
	console.log("allZones", this.allZones);
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
  ZoneModel.find({}).populate('ants').run(function(err, zones){
		if (err) return callback(err);
  	if (zones.length == 0) return callback(null);
  	_.each(zones, function(zone){
			this.allZones[zone.id] = zone;
  	}.bind(this));  	
  	return callback(null);
  }.bind(this));
};


module.exports = WorldZones;