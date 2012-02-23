var moaSchema = require('../db/moaSchema');
var Ant = require ('./ant');
var Inventory = require ('./Inventory');

var User = function(_email, password, callback){

  require('./heritate').heritate(this, User, require("../db/DataBaseItem"), moaSchema.UserModel);
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
module.exports = User;


