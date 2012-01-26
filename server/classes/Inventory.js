var mongoose = require('mongoose');
require('mongoose-types').loadTypes(mongoose);

var InventorySchema = new mongoose.Schema({
	"userEmail" :  {"type", String, "required" : "true"}
  // "email" : {"type": mongoose.SchemaTypes.Email, "index": {"unique" : true}}
  // , "password" : {"type" : String}
});
var InventoryModel = mongoose.model('InventoryModel', InventorySchema);

var Inventory = function(user){
  require('./heritate').heritate(this, Inventory, require("DataBaseItem"), new InventoryModel());
  this.user = user;
}