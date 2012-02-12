

exports.clearDB = function(){
	var moaSchema = require('../../db/moaSchema');

	moaSchema.UserModel.remove({}, function(){});	
	moaSchema.InventoryModel.remove({}, function(){});	
	
	moaSchema.AntModel.remove({}, function(){});	
	moaSchema.QueenModel.remove({}, function(){});	
	
	moaSchema.ZoneModel.remove({}, function(){});	

}

exports.loadDB = function(){
	var mongoose = require('mongoose');
	mongoose.connect("mongodb://localhost/moaTest");
}