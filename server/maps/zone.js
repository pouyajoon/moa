var moaSchema = require('../db/moaSchema.js');

var Zone = function(_zoneIdOrZoneData) {
  require('./../classes/heritate').heritate(this, Zone, require("../db/DataBaseItem"), moaSchema.ZoneModel);

  if (typeof _zoneIdOrZoneData === "string"){
    this.data.id = _zoneIdOrZoneData;
    console.log("zone created : ", this.data.id);
  }
  if (typeof _zoneIdOrZoneData === "object"){
    this.data = _zoneIdOrZoneData;
    console.log("zone loaded from db : ", this.data.id);
  }
  
  this.ants = new Array();
  this.actionNodes = new Array();
  
}

// when it's ants time
Zone.prototype.playAnts = function() {
  //console.log("play ants");
  var deleteAnts = Array();
  for (var i = 0; i < this.ants.length; ++i){
    var ant = this.ants[i];
    //if (ant == null) continue;
    ant.play(this);
    if (ant.shouldBeDeleted()){
      deleteAnts.push(i);
    }   
  } 
  for (var i = 0; i < deleteAnts.length; ++i){
    this.removeAnt(antIndex);
  }
}

Zone.prototype.removeAnt = function(_antIndex) {
  this.removeExternalItem("ants", _antIndex);
  // var dbID = this.ants[_antIndex].data._id;
  // this.ants.splice(_antIndex, 1);
  // this.data.ants.remove(dbID);
};

Zone.prototype.addAnt = function(ant) {
  this.addExternalItem("ants", ant);
  // this.ants.push(ant);
  // this.data.ants.push(ant.data);
};

module.exports = Zone;
