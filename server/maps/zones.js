var Zone = require("./zone.js");


var mongoose = require('mongoose');
var ZoneSchema = new mongoose.Schema({
  "id" : {"type": String, "index": true},
  "x" : String,
  "y" : String
});
var ZoneModel = mongoose.model('ZoneModel', ZoneSchema);

var WorldZones = function(_mongoose){
	this.allZones = {};
	this.loadFromDB();
	console.log('zones initiated');	
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
	if (typeof z === "undefined") {
		return this.createZone(zoneID, callback);
	}
	else{
		console.log("addZoneAlreadyExists", z);
		return callback(null, z);	
	}
}


WorldZones.prototype.saveToDB = function() {
	for (zID in this.allZones){
		this.allZones[zID].saveToDB();
	}
};

WorldZones.prototype.loadFromDB = function() {
	ZoneModel.find({}, function(err, zones){
		zones.forEach(function(z){
			this.allZones[z.id] = new Zone(z);
		}.bind(this));	
	}.bind(this));
};


module.exports = WorldZones;