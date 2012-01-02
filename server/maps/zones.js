var Zone = require("./zone.js");
var moaSchema = require('../mongo/moaSchema.js');


var WorldZones = function(_mongoose){
	this.allZones = {};		
	this.mongoose = _mongoose;	
	this.ZoneDB = this.mongoose.model('ZoneDB', moaSchema.ZoneSchema);

	this.loadFromDB();
	console.log('zones initiated');	
};

WorldZones.prototype.addZone = function(zID, _dbItem, callback) {
	this.createZone(zID, _dbItem, function(err, zone){
		//console.log('add zone', zID);
		this.allZones[zone.dbItem.id] = zone;
		callback(err, this.allZones[zone.dbItem.id]);
	}.bind(this));
}

WorldZones.prototype.loadZone = function(zoneID, _dbItem, callback) {
	//console.log("allZones", this.allZones);
	var z = this.allZones[zoneID];
	if (typeof z === "undefined") {
		this.addZone(zoneID, _dbItem, function(err, zone){
			//console.log("addZone", zone);
			return callback(err, zone);
		});
	}
	else{
		//console.log("addZoneAlreadyExists", z);
		return callback(null, z);	
	}
}

WorldZones.prototype.saveToDB = function() {
	for (zID in this.allZones){
		this.allZones[zID].saveToDB(this.ZoneDB);
	}
};

WorldZones.prototype.loadFromDB = function() {
	this.ZoneDB.find({}, function(err, zones){
		zones.forEach(function(z){
			this.loadZone(z.id, z, function(err, zone){
				//console.log("zone loaded from db : ", zone.dbItem.id);
			});		
		}.bind(this));	
	}.bind(this));
};


WorldZones.prototype.createZone = function(zoneID, _dbItem, callback){
  var positions = zoneID.split('_');
  //console.log('create zone', zoneID, positions, _dbItem);
  if (_dbItem == null){
  	//console.log('_dbItem is null');
	  this.ZoneDB.findOne({"id" : zoneID}, function(err, zone){
	    //console.log("find one", zone);
	    if (err) throw err;	    
	    if (zone != null){
	    	var z = new Zone(zoneID, this.ZoneDB, zone);
	      return callback(null, z);
	    } else {
	    	var z = new Zone(zoneID, this.ZoneDB);
	    	return callback(null, z);	      
	    }	    
	  }.bind(this));  	
  } else {
  	var z = new Zone(zoneID, this.ZoneDB, _dbItem);
  	return callback(null, z);  	
  }
}

module.exports = WorldZones;