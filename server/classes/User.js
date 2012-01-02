
var moaSchema = require('../mongo/moaSchema.js');

var User = function(_email){
  this.email = _email;
}

module.exports = User;