var Step = require('common').step;


exports.clearDB = function(callback){
	var moaSchema = require('../../db/moaSchema');
	Step([
		function(next){ moaSchema.UserModel.remove({}, next) }
		, function(next){ moaSchema.InventoryModel.remove({}, next) }
		, function(next){ moaSchema.AntModel.remove({}, next) }
		, function(next){ moaSchema.QueenModel.remove({}, next) }
		, function(next){ moaSchema.ZoneModel.remove({}, callback) }
	], callback);
}

var mongoose = require('mongoose');

exports.loadDB = function(callback){	
	mongoose.connect("mongodb://localhost/moaTest");
	callback();
}

exports.closeDB = function(callback){
	//exports.clearDB(function(){
		mongoose.disconnect();	
		callback();
	//});
	
	
}