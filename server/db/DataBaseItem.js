var DataBaseItem = function(_model){
	this.model = _model;
  this.data = new this.model();
}


DataBaseItem.prototype.saveToDB = function(callback){
  if (this.data == null) callback(new Error("data should not be null"));
  //console.log("before save data", this.data);
  this.data.save(function(err){
    //console.log("save data", err);
    if (err) {
      return callback(err, this);
    }
    return callback(null, this);
  }.bind(this));
}


DataBaseItem.prototype.loadFromKey = function(_filter) {
  this.getOne(this.model, _filter, function(err, data){
    if (err) callback(err);
    this.data = data;
    return callback(null);
  });
};

DataBaseItem.prototype.hasOne = function(_filter, callback){
  this.model.find(_filter, function(err, u){
    if (err) return callback(err, false, null);
    if (u == null) return callback(null, false, null);
    if (u.length > 1) return callback( (typeof this) + " exists too many times, should be one.", false, null);
    if (u.length == 0) return callback(null, false, null);    
    return callback(null, true, u);
  });  
}

DataBaseItem.prototype.getOne = function(_filter, callback){
  this.hasOne(_filter, function(err, exists, element){
    if (err) return callback(err, null);
    return callback(null, element);
  });
}

DataBaseItem.prototype.removeExternalItem = function(listName, itemIndex) {
  var dbID = this[listName][itemIndex].data._id;
  this[listName].splice(itemIndex, 1);
  this.data[listName].remove(dbID);
};

DataBaseItem.prototype.addExternalItem = function(listName, item) {
  this[listName].push(item);
  this.data[listName].push(item.data);
};

module.exports = DataBaseItem;