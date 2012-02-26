var moaSchema = require('../db/moaSchema');
var Ant = require ('./ant');
var Inventory = require ('./Inventory');
var _ = require('underscore');

var UserModel = moaSchema.UserModel;
var InventoryModel = moaSchema.InventoryModel;

require('./heritate').implements(UserModel, require("../db/DataBaseItem"));


exports.createUser = function(_email, _password, callback){
  var u = new UserModel();
  u.setup(_email, _password, function(err, _u){
    callback(err, u);
  });
}


UserModel.prototype.getInventory = function(callback){
  InventoryModel.findOne({"_id" : this.inventory}, function(err, inventory){
    if (err) return callback(err);
//    console.log(inventory);
    return callback(err, inventory);
  });
}


UserModel.prototype.setup = function(_email, _password, callback){
//  require('./heritate').heritate(this, UserModel, require("../db/DataBaseItem"), UserModel);
//  console.log(this.__proto__);
  //_.extend(this, require("../db/DataBaseItem"));
  this.model = UserModel;
  //console.log("usermodel create", this);
  this.email = _email;  
  if (!_.isUndefined(_password)){
    this.password = _password;
  } 

  require('./Inventory').createInventory(this, function(err, inventory){
    if (err) return callback(err);
    this.inventory = inventory;    
    return this.saveToDB(callback);
  }.bind(this));

}


var User = function(_email, password, callback){

  require('./heritate').heritate(this, User, require("../db/DataBaseItem"), UserModel);
  this.data.email = _email;  
  if (typeof password !== "undefined"){
    this.data.password = password;
  }

  new Inventory(function(err, i){
    this.setInventory(i);
    this.saveToDB(function(err, user){
      return callback(err, this);
    }.bind(this))
  }.bind(this))
}


User.prototype.setInventory = function(_inventory) {
  this.inventory = _inventory;
  this.data.inventory = _inventory.data;
};

User.prototype.exists = function(callback){
  this.hasOne({'email' : this.data.email}, callback);
}

User.prototype.existsWithPassword = function(callback){
  return this.hasOne({'email' : this.data.email, 'password' : this.data.password}, callback);
}
//module.exports = User;


