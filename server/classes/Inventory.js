var moaSchema = require('../db/moaSchema');
var Ant = require('./ant');

var InventoryModel = moaSchema.InventoryModel;


require('./heritate').implements(InventoryModel, require("../db/DataBaseItem"), InventoryModel);

exports.createInventory = function(user, callback){
	var i = new InventoryModel({"_user" : user._id});
	user.inventory = i;
	Ant.createAntFromInventory(i, function(err, a){
		i.ants.push(a);
		i.saveToDB(callback);
	});
}

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