var mongoose = require('mongoose');
require('mongoose-types').loadTypes(mongoose);

var UserSchema = new mongoose.Schema({
  "email" : {"type": mongoose.SchemaTypes.Email, "index": {"unique" : true}}
  , "password" : {"type" : String}
});
var UserModel = mongoose.model('UserModel', UserSchema);

var User = function(_email, password){
  require('./heritate').heritate(this, User, require("../db/DataBaseItem"), new UserModel());
  this.dbItem.email = _email;  
  if (typeof password !== "undefined"){
    this.dbItem.password = password;
  }
}

User.prototype.exists = function(callback){
  this.hasOne(UserModel, {'email' : this.dbItem.email}, callback);
}

User.prototype.existsWithPassword = function(callback){
  this.hasOne(UserModel, {'email' : this.dbItem.email, 'password' : this.dbItem.password}, callback);
}

module.exports = User;


