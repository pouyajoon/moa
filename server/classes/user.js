var moaSchema = require('../db/moaSchema');
var Ant = require ('./ant');
var Inventory = require ('./Inventory');

//var Step = require('step');

var User = function(_email, password, callback){

  require('./heritate').heritate(this, User, require("../db/DataBaseItem"), moaSchema.UserModel);
  this.data.email = _email;  
  if (typeof password !== "undefined"){
    this.data.password = password;
  }

  // Step([
  //   function(next){
  //     this.createNewInventory(next);
  //   }.bind(this),
  //   function(err, inventory, next){
  //     this.saveToDB(next);
  //   }.bind(this)
  // ], callback);

    //, this.saveToDB, callback);
  //   function(next) {      
     
  //   }.bind(this),
  //   function(err) {
  //    console.log('user step save to db ');
  //    this.saveToDB(err, function(err, u){
  //     return callback(null, this)
  //    }.bind(this));
  //   }.bind(this)
  // );

//  thie.createInventory()
  new Inventory(function(err, i){
    this.setInventory(i);
    this.saveToDB(function(err, user){
      return callback(err, this);
    }.bind(this))
  }.bind(this))

  //setInventory()
  // this.createNewInventory(function(err){
  //   if (err) return callback(err, null);
  //   this.saveToDB(function(err){
  //     if (err) return callback(err, null);
  //     return callback(null, this)
  //   }.bind(this));      
  // }.bind(this));
}


User.prototype.setInventory = function(_inventory) {
  this.inventory = _inventory;
  this.data.inventory = _inventory.data;
};

// User.prototype.createNewInventory = function(callback){
//   //console.log('create intentory')
// 	this.inventory = new Inventory(this);
// 	new Ant({"x" : 200, "y" : 200}, {"w" : 50, "h" : 50}, function(err, _ant){
//     //console.log("ant", _ant);
//     this.inventory.addAnt(_ant);
//     this.data.inventory = this.inventory.data;
//     this.inventory.saveToDB(function(err, i){
//       return callback(err, i);
//     });
//   }.bind(this));
// }

User.prototype.exists = function(callback){
  this.hasOne({'email' : this.data.email}, callback);
}

User.prototype.existsWithPassword = function(callback){
  this.hasOne({'email' : this.data.email, 'password' : this.data.password}, callback);
}
module.exports = User;


