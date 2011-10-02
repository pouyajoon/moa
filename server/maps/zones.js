//var libPosition = require("../classes/position");
require ('prototype');
var libZone = require("./zone.js");

exports.WorldZones = Class.create({
	initialize : function(){
		this.allZones = {};		
		console.log('zones initiated');
	},
	addZone : function(x, y){
		var z = new libZone.Zone(x, y);
		this.allZones[z.id] = z;
	},
	loadZone : function(zone_id){
		var z = this.allZones[zone_id];
		if (z == null) {
			this.addZone(zone_id.split("_")[0], zone_id.split("_")[1]);
			z = this.allZones[zone_id];
		}
		return z;
	}
});


