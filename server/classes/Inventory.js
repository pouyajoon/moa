var moaSchema = require('../db/moaSchema');
var Ant = require('./ant');

var Inventory = function(callback){
  require('./heritate').heritate(this, Inventory, require("../db/DataBaseItem"), moaSchema.InventoryModel);
  this.ants = [];
  //this.saveToDB(callback);

	new Ant({"x" : 0, "y" : 0}, {"w" : 50, "h" : 50}, function(err, _ant){
    this.addAnt(_ant);
    this.saveToDB(callback);
  }.bind(this));
}

Inventory.prototype.addAnt = function(ant) {
	this.addExternalItem("ants", ant);
};

Inventory.prototype.removeAnt = function(_antIndex){
	this.removeExternalItem("ants", _antIndex);
};

module.exports = Inventory;