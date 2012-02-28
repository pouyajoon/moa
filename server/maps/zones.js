var Zone = require("./zone.js");
var _ = require('underscore');


// var mongoose = require('mongoose');
// var ZoneSchema = new mongoose.Schema({
//   "id" : {"type": String, "index": true},
//   "x" : String,
//   "y" : String
// });
// var ZoneModel = mongoose.model('ZoneModel', ZoneSchema);

var moaSchema = require('../db/moaSchema');
var ZoneModel = moaSchema.ZoneModel;

var WorldZones = function(callback){
	this.allZones = {};
	//console.log("loading zones");
	this.loadFromDB(function(err){		
		if (err) return callback(err);
		return callback(err, this);
	}.bind(this));
};


WorldZones.prototype.createZone = function(_zoneID, callback){
 //console.log("create zone");
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
	//console.log("allZones", this.allZones, z);
	if (_.isUndefined(z)) {		
		return this.createZone(zoneID, callback);
	}
	else{
		//console.log("addZoneAlreadyExists", z);
		return callback(null, z);	
	}
}


WorldZones.prototype.loadFromDB = function(callback) {
	//console.log(ZoneModel);
	
	ZoneModel.find({}, function(err, zones){
		//console.log(zones);
		if (zones.length == 0) return callback(null);
		_.each(zones, function(zone){
			//console.log("LOAD ZONE", zone);
			this.allZones[zone.id] = zone;	
		}.bind(this));
		return callback(null);
	}.bind(this));
	
};


module.exports = WorldZones;