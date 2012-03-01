var moaSchema = require('../db/moaSchema');
var Ant = require ('./ant');
var _ = require('underscore');

var UserModel = moaSchema.UserModel;
var InventoryModel = moaSchema.InventoryModel;
var Inventory = require ('./Inventory');


UserModel.prototype.getInventory = function(callback){
  InventoryModel.findOne({"_id" : this.inventory}, function(err, inventory){
    if (err) return callback(err);
    return callback(null, inventory);
  });
}


UserModel.prototype.setup = function(_email, _password, callback){
  this.model = UserModel;
  this.email = _email;  
  if (!_.isUndefined(_password)){
    this.password = _password;
  } 
  Inventory.createInventory(this, function(err, inventory){
    if (err) return callback(err);
    return this.saveToDB(callback);
  }.bind(this));

}



exports.createUser = function(_email, _password, callback){
  var u = new UserModel();
  u.setup(_email, _password, function(err, _u){
    callback(err, u);
  });
}

exports.UserModel = UserModel;

// var User = function(_email, password, callback){

//   require('./heritate').heritate(this, User, require("../db/DataBaseItem"), UserModel);
//   this.data.email = _email;  
//   if (typeof password !== "undefined"){
//     this.data.password = password;
//   }

//   new Inventory(function(err, i){
//     this.setInventory(i);
//     this.saveToDB(function(err, user){
//       return callback(err, this);
//     }.bind(this))
//   }.bind(this))
// }


// User.prototype.setInventory = function(_inventory) {
//   this.inventory = _inventory;
//   this.data.inventory = _inventory.data;
// };

// User.prototype.exists = function(callback){
//   this.hasOne({'email' : this.data.email}, callback);
// }

// User.prototype.existsWithPassword = function(callback){
//   return this.hasOne({'email' : this.data.email, 'password' : this.data.password}, callback);
// }
//module.exports = User;


