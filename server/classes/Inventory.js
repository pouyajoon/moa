var mongoose = require('mongoose');

var InventorySchema = require('../db/moaSchema.js').InventorySchema;
var InventoryModel = mongoose.model('InventoryModel', InventorySchema);

var Inventory = function(user){
  require('./heritate').heritate(this, Inventory, require("../db/DataBaseItem"), new InventoryModel());
  this.user = user;
  this.ants = [];
}

Inventory.prototype.addAnt = function(ant) {
	this.ants.push(ant);
	this.data.ants.push(ant.data);
};

module.exports = Inventory;