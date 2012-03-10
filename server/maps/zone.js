var moaSchema = require('../db/moaSchema.js');
var _ = require('underscore');


var AntModel = moaSchema.AntModel;
var Ant = require('./../classes/ant');

var ZoneModel = moaSchema.ZoneModel;

//require('./../classes/heritate').implements(ZoneModel, require("../db/DataBaseItem"), ZoneModel);

exports.createZone = function(_zoneId, callback){
  var z = new ZoneModel({"id" : _zoneId});
  return z.saveToDB(callback);
};

ZoneModel.prototype.addAnt = function(ant, callback){
  this.addExternalItem("_zone", "ants", ant, callback);
  // ant._zone = this._id;
  // this.ants.push(ant._id);
  // return this.saveToDB(function(err, zone){
  //   if (err) return callback(err);
  //   return ant.saveToDB(callback);
  // });
};

ZoneModel.prototype.removeAnt = function(antID, callback){
  this.removeExternalItem(this.getAnts.bind(this), "_zone", 'ants', antID, callback);
};


ZoneModel.prototype.getAnts = function(callback) {
  return this.getExternalElements({ "_zone" : this._id},  'ants', AntModel, callback);
};


ZoneModel.prototype.playAnts = function(callback) {
  this.getAnts(function(err, ants){
    if (err) callback(err);
    _.each(ants, function(a){
      a.play();
    });
    //return callback();
  });
};
