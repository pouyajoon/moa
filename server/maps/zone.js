var moaSchema = require('../db/moaSchema.js');
var _ = require('underscore');


var AntModel = moaSchema.AntModel;
var Ant = require('./../classes/ant');

var ZoneModel = moaSchema.ZoneModel;

require('./../classes/heritate').implements(ZoneModel, require("../db/DataBaseItem"), ZoneModel);

exports.createZone = function(_zoneId, callback){
  var z = new ZoneModel({"id" : _zoneId});
  return z.saveToDB(callback);
}

ZoneModel.prototype.createAnt = function(callback){
  Ant.createAnt(function(err, ant){
    ant.zone = this._id;
    return this.addAnt(ant, callback);   
  }.bind(this));
};

ZoneModel.prototype.addAnt = function(ant, callback){  
  this.ants.push(ant._id); 
  // return callback(null);
  return this.saveToDB(function(err, zone){
    return callback(err, ant);
  });
};
