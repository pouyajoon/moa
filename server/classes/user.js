var mongoose = require('mongoose');

var UserSchema = require('../db/moaSchema.js').UserSchema;
var UserModel = mongoose.model('UserModel', UserSchema);

var Queen = require ('./queen');
//var Ant = require ('./ant');
var Inventory = require ('./Inventory');

var User = function(_email, password){
  require('./heritate').heritate(this, User, require("../db/DataBaseItem"), new UserModel());
  this.data.email = _email;  
  if (typeof password !== "undefined"){
    this.data.password = password;
  }
  this.createNewInventory();
}

User.prototype.createNewInventory = function(){
	this.inventory = new Inventory(this);
	var q = new Queen(this.data.email, {"x" : 0, "y" : 0});
	this.inventory.addAnt(q);
	this.data.inventory = this.inventory.data;
}

User.prototype.exists = function(callback){
  this.hasOne(UserModel, {'email' : this.data.email}, callback);
}

User.prototype.existsWithPassword = function(callback){
  this.hasOne(UserModel, {'email' : this.data.email, 'password' : this.data.password}, callback);
}
module.exports = User;


