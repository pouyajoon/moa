var mongoose = require('mongoose');

var UserSchema = require('../db/moaSchema.js').UserSchema;
var UserModel = mongoose.model('UserModel', UserSchema);

var User = function(_email, password){
  require('./heritate').heritate(this, User, require("../db/DataBaseItem"), new UserModel());
  this.data.email = _email;  
  if (typeof password !== "undefined"){
    this.data.password = password;
  }
}

User.prototype.exists = function(callback){
  this.hasOne(UserModel, {'email' : this.data.email}, callback);
}

User.prototype.existsWithPassword = function(callback){
  this.hasOne(UserModel, {'email' : this.data.email, 'password' : this.data.password}, callback);
}

module.exports = User;


