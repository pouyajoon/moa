var mongoose = require('mongoose');

var ZoneSchema = require('../db/moaSchema.js').ZoneSchema;

var ZoneModel = mongoose.model('ZoneModel', ZoneSchema);



var Zone = function(_zoneIdOrZoneData) {
  require('./../classes/heritate').heritate(this, Zone, require("../db/DataBaseItem"), new ZoneModel());

  if (typeof _zoneIdOrZoneData === "string"){
    this.data.id = _zoneIdOrZoneData;
    console.log("zone created : ", this.data.id);
  }
  if (typeof _zoneIdOrZoneData === "object"){
    this.data = _zoneIdOrZoneData;
    console.log("zone loaded from db : ", this.data.id);
  }
  
  // if (typeof zID == undefined){
  //   console.log('zID is undefined');
  //   this.saveToDB();
  // }
 
  // this.loadFromKey(ZoneModel, {"id" : zID}, function(err){
  //   if (err) throw err;
  // });
  
  this.ants = new Array();
  this.actionNodes = new Array();
  
}

// Zone.prototype.saveToDB = function(){
//   this.data.save(function(err){
//     if (err) {throw err;} 
//   }.bind(this));
// }

module.exports = Zone;
