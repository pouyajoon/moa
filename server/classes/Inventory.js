var mongoose = require('mongoose');

var InventorySchema = require('../db/moaSchema.js').InventorySchema;
var InventoryModel = mongoose.model('InventoryModel', InventorySchema);

var Inventory = function(user){
  require('./heritate').heritate(this, Inventory, require("DataBaseItem"), new InventoryModel());
  this.user = user;
}