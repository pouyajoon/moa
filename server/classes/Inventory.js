var mongoose = require('mongoose');
require('mongoose-types').loadTypes(mongoose);

var InventorySchema = new mongoose.Schema({
  // "email" : {"type": mongoose.SchemaTypes.Email, "index": {"unique" : true}}
  // , "password" : {"type" : String}
});
var InventoryModel = mongoose.model('InventoryModel', InventorySchema);

var User = function(_email, password){
  this.dbItem = new UserModel();
  this.dbItem.email = _email;  
  if (typeof password !== "undefined"){
    this.dbItem.password = password;
  }
}