var mongoose = require('mongoose');
require('mongoose-types').loadTypes(mongoose);
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  "email" : {"type": mongoose.SchemaTypes.Email, "index": {"unique" : true}}
  , "password" : {"type" : String}
});
var UserModel = mongoose.model('UserModel', UserSchema);

var User = function(_email, password){
  this.dbItem = new UserModel();
  this.dbItem.email = _email;  
  if (typeof password !== "undefined"){
    this.dbItem.password = password;
  }
}

User.prototype.saveToDB = function(callback){
  if (this.dbItem == null) return;
  this.dbItem.save(function(err){
    if (err) {
      return callback(err);
    }
    return callback(null);
  }.bind(this));
}


function hasOne(_model, _filter, _name, callback){
  _model.find(_filter, function(err, u){
    if (err) return callback(err, false);
    if (u == null) return callback(null, false);
    if (u.length > 1) return callback( _name + " exists too many times", false);
    if (u.length == 0) return callback(null, false);    
    return callback(null, true)
  });  
}

User.prototype.exists = function(callback){
//  console.log('search ', this.dbItem.email);
  hasOne(UserModel, {'email' : this.dbItem.email}, 'The email', callback);
}

User.prototype.existsWithPassword = function(callback){
//  console.log('search with pwd ', this.dbItem.email);
  hasOne(UserModel, {'email' : this.dbItem.email, 'password' : this.dbItem.password}, 'The user ', callback);
}

module.exports = User;


