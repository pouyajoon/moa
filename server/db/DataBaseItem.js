var DataBaseItem = function(_data){
	this.data = _data;
}


DataBaseItem.prototype.saveToDB = function(callback){
  if (this.data == null) return;
  this.data.save(function(err){
    if (err) {
      return callback(err);
    }
    return callback(null);
  }.bind(this));
}


DataBaseItem.prototype.loadFromKey = function(_model, _filter) {
  this.getOne(_model, _filter, function(err, data){
    if (err) throw err;
    this.data = data;
    return callback(null);
  });
};

DataBaseItem.prototype.hasOne = function(_model, _filter, callback){
  _model.find(_filter, function(err, u){
    if (err) return callback(err, false);
    if (u == null) return callback(null, false);
    if (u.length > 1) return callback( (typeof this) + " exists too many times, should be one.", false);
    if (u.length == 0) return callback(null, false);    
    return callback(null, true, u);
  });  
}

DataBaseItem.prototype.getOne = function(_model, _filter, callback){
  this.hasOne(_model, _filter, function(err, exists, element){
    if (err) return callback(err, null);
    return callback(null, element);
  });
}


module.exports = DataBaseItem;