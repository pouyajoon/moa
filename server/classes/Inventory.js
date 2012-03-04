var moaSchema = require('../db/moaSchema');
var Ant = require('./ant');
var _ = require("underscore");
var InventoryModel = moaSchema.InventoryModel;
var AntModel = moaSchema.AntModel;

//require('./heritate').implements(InventoryModel, require("../db/DataBaseItem"), InventoryModel);

exports.createInventory = function(user, callback){
	var i = new InventoryModel({"_user" : user._id});
	user.inventory = i;
	Ant.createAntFromInventory(i, function(err, a){
		i.ants.push(a);
		i.saveToDB(callback);
	});

}

InventoryModel.prototype.getAnts = function(callback) {
	return this.getExternalElements({ "_inventory" : this._id},  'ants', AntModel, callback);
};

// Finds an index of an item using a testing function.
function findIndex(array, fn) {
  for (i = 0, l = array.length; i < l; i++) { if (fn(array[i])) return i; }
  return -1;
};


InventoryModel.prototype.removeAnt = function(ants, antID, callback) {
	var antIndex = findIndex(this.ants, function(ant){
		return ant == antID;
	});
	var antFound = ants[antIndex];
	if (antIndex == -1 || _.isUndefined(antFound)){
		return callback("Unable to find the ant in the user's inventory");
	}
	antFound._inventory = null;
	this.ants.splice(antIndex, 1);
	return this.saveToDB(function(err, i){
		return antFound.saveToDB(callback);
	})
};


// var Inventory = function(callback){
  
//   this.ants = [];

// 	this.saveToDB(callback);
// 	// new Ant({"x" : 0, "y" : 0}, {"w" : 50, "h" : 50}, function(err, _ant){
//  //    this.addAnt(_ant);
    
//  //  }.bind(this));
// }

// Inventory.prototype.addAnt = function(ant) {
// 	this.addExternalItem("ants", ant);
// };

// Inventory.prototype.removeAnt = function(_antIndex){
// 	this.removeExternalItem("ants", _antIndex);
// };

//module.exports = Inventory;