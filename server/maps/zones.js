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
	this.loadFromDB(function(err){		
		return callback(err);
	});
};


WorldZones.prototype.createZone = function(zoneID, callback){
	this.allZones[zoneID] = new Zone(zoneID);
	this.allZones[zoneID].saveToDB(function(err){
		if (err) return callback(err, null);
		return callback(null, this.allZones[zoneID]);
	}.bind(this));
}

WorldZones.prototype.getZone = function(zoneID, callback) {
	//console.log("allZones", this.allZones);
	var z = this.allZones[zoneID];
	if (_.isUndefined(z)) {
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
	ZoneModel.find({}, function(err, zones){
		zones.forEach(function(z){
			//console.log("loading zone", z);
			this.allZones[z.id] = new Zone(z);
		}.bind(this));
		//console.log('zones loaded from db');	
		return callback(null);
	}.bind(this));
	// console.log('no item');	
	// return callback("no item");
};


module.exports = WorldZones;