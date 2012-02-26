var mongoose = require('mongoose');
require('mongoose-types').loadTypes(mongoose);

exports.ZoneSchema = new mongoose.Schema({
  "id" : {"type": String, "index": {"unique" : true}}
  , "ants" : [{"type" : mongoose.Schema.ObjectId, "ref" : exports.AntSchema}]
});
exports.ZoneModel = mongoose.model('ZoneModel', exports.ZoneSchema);

exports.InventorySchema = new mongoose.Schema({
	"ants" : [{"type" : mongoose.Schema.ObjectId, "ref" : exports.AntSchema}]
	,_user : { type: mongoose.Schema.ObjectId, ref: exports.UserSchema }
});

exports.InventoryModel = mongoose.model('InventoryModel', exports.InventorySchema);

exports.UserSchema = new mongoose.Schema({
  "email" : {"type": mongoose.SchemaTypes.Email, "index": {"unique" : true}}
  , "password" : {"type" : String}
  , "inventory" : {"type" : mongoose.Schema.ObjectId, "ref" : exports.InventorySchema}
});

exports.UserModel = mongoose.model('UserModel', exports.UserSchema);

exports.QueenSchema = new mongoose.Schema({
	"name" : {"type" : String}
	, "action" : {"type": String, "default" : "idle", "enum" : ["move", "idle", "dig"]}
	, "angle" : {"type" : Number, "default" : 0}
	, "direction" : {"type" : Number, "default" : 0}
	, "position" : {
		"x" : {"type": Number, "default" : 0}
		,"y" : {"type": Number, "default" : 0}
	}
	,	"size" : {
		"w" : {"type": Number, "default" : 0}
		,"h" : {"type": Number, "default" : 0}
	}
});
exports.QueenModel = mongoose.model('QueenModel', exports.QueenSchema);

exports.AntSchema = new mongoose.Schema({
	"action" : {"type": String, "default" : "idle", "enum" : ["move", "idle", "dig"]}
	, "angle" : {"type" : Number, "default" : 0}
	, "direction" : {"type" : Number, "default" : 0}
	, "position" : {
		"x" : {"type": Number, "default" : 0}
		,"y" : {"type": Number, "default" : 0}
	}
	,	"size" : {
		"w" : {"type": Number, "default" : 0}
		,"h" : {"type": Number, "default" : 0}
	}
	,_zone : { type: mongoose.Schema.ObjectId, ref: exports.ZoneModel }
});
exports.AntModel = mongoose.model('AntModel', exports.AntSchema);




// exports.PhysicElementSchema = new mongoose.Schema({
// 	"position" : {
// 		"x" : {"type": Number, "default" : 0}
// 		,"y" : {"type": Number, "default" : 0}
// 	}
// 	,	"size" : {
// 		"w" : {"type": Number, "default" : 0}
// 		,"h" : {"type": Number, "default" : 0}
// 	}
// });

//console.log("exports.PhysicElementSchema", exports.PhysicElementSchema, "exports.AntSchema", exports.AntSchema);

//require('./../classes/heritate').heritate(this, exports.AntSchema, exports.PhysicElementSchema);