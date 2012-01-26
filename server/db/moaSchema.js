var mongoose = require('mongoose');
require('mongoose-types').loadTypes(mongoose);

exports.ZoneSchema = new mongoose.Schema({
  "id" : {"type": String, "index": true}
});

exports.InventorySchema = new mongoose.Schema({
	"ants" : [exports.AntSchema]
});

exports.UserSchema = new mongoose.Schema({
  "email" : {"type": mongoose.SchemaTypes.Email, "index": {"unique" : true}}
  , "password" : {"type" : String}
  , "inventories" : [exports.InventorySchema]
});




exports.AntSchema = new mongoose.Schema({
	
});