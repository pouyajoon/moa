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

// WorldZones.prototype.addZone = function(zID, _dbItem, callback) {
// 	this.createZone(zID, _dbItem, function(err, zone){
// 		//console.log('add zone', zID);
// 		this.allZones[zone.dbItem.id] = zone;
// 		callback(err, this.allZones[zone.dbItem.id]);
// 	}.bind(this));
// }

// WorldZones.prototype.loadZone = function(zoneID, _dbItem, callback) {
// 	//console.log("allZones", this.allZones);
// 	var z = this.allZones[zoneID];
// 	if (typeof z === "undefined") {
// 		this.addZone(zoneID, _dbItem, function(err, zone){
// 			//console.log("addZone", zone);
// 			return callback(err, zone);
// 		});
// 	}
// 	else{
// 		//console.log("addZoneAlreadyExists", z);
// 		return callback(null, z);	
// 	}
// }


WorldZones.prototype.createZone = function(zoneIdOrZoneData, callback){
	if (typeof zoneIdOrZoneData === "string"){
		return new Zone()
	}
}

WorldZones.prototype.getZone = function(zoneID, callback) {
	//console.log("allZones", this.allZones);
	var z = this.allZones[zoneID];
	if (typeof z === "undefined") {
		var loadedZone = new Zone(zoneID, null);
		loadedZone.saveToDB(function(err){
			if (err) return callback(err);
			this.allZones[zoneID] = loadedZone;	
			return callback(null, loadedZone);
		});
	}
	else{
		// console.log("addZoneAlreadyExists", z);
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
			var loadedZone = new Zone(z.id, z);
			this.allZones[z.id] = loadedZone;
			// console.log("zone loaded from db : ", loadedZone.data.id);
		}.bind(this));	
	}.bind(this));
};


// WorldZones.prototype.createZone = function(zoneID, _dbItem, callback){
//   var positions = zoneID.split('_');
//   //console.log('create zone', zoneID, positions, _dbItem);
//   if (_dbItem == null){
//   	//console.log('_dbItem is null');
// 	  ZoneModel.findOne({"id" : zoneID}, function(err, zone){
// 	    //console.log("find one", zone);
// 	    if (err) throw err;	    
// 	    if (zone != null){
// 	    	var z = new Zone(zoneID, this.ZoneDB, zone);
// 	      return callback(null, z);
// 	    } else {
// 	    	var z = new Zone(zoneID, this.ZoneDB);
// 	    	return callback(null, z);	      
// 	    }	    
// 	  }.bind(this));  	
//   } else {
//   	var z = new Zone(zoneID, this.ZoneDB, _dbItem);
//   	return callback(null, z);  	
//   }
// }

module.exports = WorldZones;