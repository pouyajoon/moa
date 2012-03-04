var moaSchema = require('../db/moaSchema.js');
var _ = require('underscore');


var AntModel = moaSchema.AntModel;
var Ant = require('./../classes/ant');

var ZoneModel = moaSchema.ZoneModel;

//require('./../classes/heritate').implements(ZoneModel, require("../db/DataBaseItem"), ZoneModel);

exports.createZone = function(_zoneId, callback){
  var z = new ZoneModel({"id" : _zoneId});
  return z.saveToDB(callback);
}

ZoneModel.prototype.createAnt = function(position, callback){
  Ant.createAnt(function(err, ant){
    return this.addAnt(ant, position, callback);   
  }.bind(this));
};

ZoneModel.prototype.addAnt = function(ant, position, callback){
  ant._zone = this._id;
  ant.position = position;
  console.log("ANT",ant);
  this.ants.push(ant._id); 
  //return callback(null);
  return this.saveToDB(function(err, zone){
    //console.log(err);
    if (err) return callback(err);
    //console.log("ant", err);
    return ant.saveToDB(callback);
  });
};

ZoneModel.prototype.getAnts = function(callback) {
  return this.getExternalElements({ "_zone" : this._id},  'ants', AntModel, callback);
};
