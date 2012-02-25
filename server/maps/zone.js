var moaSchema = require('../db/moaSchema.js');

var Zone = function(_zoneId, callback) {
  require('./../classes/heritate').heritate(this, Zone, require("../db/DataBaseItem"), moaSchema.ZoneModel);


  this.data.id = _zoneId;

  this.ants = new Array();
  this.actionNodes = new Array();  

  this.hasOne({"id" : _zoneId}, function(err, exists, zone){
    //console.log("zone has one :", err, exists, zone);
    

    if (err) return callback(err);
    if (exists){
      this.data = zone[0];
      return callback(null, this);
    }
    else {

      this.saveToDB(function(err){
        //console.log("zone save :", err);
        if (err) return callback(err, null);
        return callback(null, this);
      }.bind(this));
    }
  }.bind(this));


  
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
