var moaSchema = require('../db/moaSchema.js');
var _ = require('underscore');


var AntModel = moaSchema.AntModel;
var Ant = require('./../classes/ant');

var ZoneModel = moaSchema.ZoneModel;


require('./../classes/heritate').implements(ZoneModel, require("../db/DataBaseItem"), ZoneModel);

exports.createZone = function(_zoneId, callback){
  var z = new ZoneModel({"id" : _zoneId});
  z.saveToDB(callback);
}


// var Zone = function(_zoneId, callback, zoneDB) {
//   require('./../classes/heritate').heritate(this, Zone, require("../db/DataBaseItem"), ZoneModel);

//   this.data.id = _zoneId;
//   this.ants = new Array();
//   this.actionNodes = new Array();  

//   this.loadFromDB({"id" : _zoneId}, zoneDB, function(){
//     console.log("load zone from db", this.data);
//     _.each(this.data.ants, function(a){
//       console.log('ant :', a);
//     });
//   }, callback);

// }

//var ZoneModel = moaSchema.ZoneModel;

// ZoneModel.prototype.hello = function() {
//   console.log("hello");
// };

ZoneModel.prototype.createAnt = function(callback){
  Ant.createAnt(function(err, ant){
    ant.zone = this._id;    
    ant.saveToDB(function(err){
      if (err) return callback(err);
      return this.addAnt(ant, callback);  
    }.bind(this));    
  }.bind(this));
};

ZoneModel.prototype.addAnt = function(ant, callback){
  return callback(null);
  // this.ants.push(ant); 
  // this.saveToDB(callback);
};


// Zone.prototype.loadFromDB = function(filter, dbItem, loadExternalItems, callback) {
//   this.data.hello();
//   if (!_.isUndefined(dbItem)){
//     this.data = dbItem;
//     callback(null, this);
//   } else {
//     this.hasOne(filter, function(err, exists, item){
//       //console.log("item has one :", err, exists, item);
//       if (err) return callback(err);
//       if (exists){
//         this.data = item[0];
//         return loadExternalItems().bind(this);

        
//         // _.each(this.data.ants, function(a){
//         //   console.log('ant :', a);
//         // });
//         // return callback(null, this);
//       }
//       else {
//         this.saveToDB(function(err){
//           //console.log("item save :", err);
//           if (err) return callback(err, null);
//           return callback(null, this);
//         }.bind(this));
//       }
//     }.bind(this));    
//   }  
// };

// when it's ants time
ZoneModel.prototype.playAnts = function() {
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

// Zone.prototype.removeAnt = function(_antIndex) {
//   this.removeExternalItem("ants", _antIndex);
// };

// Zone.prototype.addAnt = function(ant) {
//   this.addExternalItem("ants", ant);
// };

//module.exports = Zone;
