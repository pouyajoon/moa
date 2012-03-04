var moaSchema = require("./moaSchema");
var UserModel = moaSchema.UserModel;
var _ = require('underscore');

var DataBaseItem = function(_model){
	this.model = _model;
}


DataBaseItem.prototype.saveToDB = function(callback){
  this.save(function(err){
    if (err) return callback(err, this);
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
    var u = u[0];
    return callback(null, true, u);
  }.bind(this));  
}

DataBaseItem.prototype.getOne = function(_filter, callback){
  this.hasOne(_filter, function(err, exists, element){
    if (err) return callback(err, null);
    return callback(null, element);
  });
}


DataBaseItem.prototype.addExternalItem = function(_parentName, elementsName, item, callback){
  item[_parentName] = this._id;
  this[elementsName].push(item._id); 
  return this.saveToDB(function(err, zone){
    if (err) return callback(err);
    return item.saveToDB(callback);
  });
}

DataBaseItem.prototype.getExternalElements = function(filter, elementsName, externalModel, callback) {
  externalModel.find(filter).populate(elementsName).run(function(err, elements){
    if (err) return callback(err);
    return callback(null, elements);
  }.bind(this));  
};

DataBaseItem.prototype.getExternalItem = function(_model, itemID, callback) {
  var a = new _model();
  a.model = _model;
  a.hasOne({"_id" : itemID}, function(err, exists, item){
    if (err) return callback(err);
    if (!exists) return callback("Do no exists");
    return callback(null, item);
  });
};

function findIndex(array, fn) {
  for (i = 0, l = array.length; i < l; i++) { if (fn(array[i])) return i; }
  return -1;
};

DataBaseItem.prototype.removeExternalItem = function(externalElementsGetFunction, _parentName, elementsName, itemID, callback) {
  externalElementsGetFunction(function(err, items){
    var itemIndex = findIndex(items, function(item){
      console.log(item._id, itemID);
      return _.isEqual(item._id.toString(), itemID);
    });
    console.log(itemIndex, itemID, items);
    var itemFound = items[itemIndex];
    if (itemIndex == -1 || _.isUndefined(itemFound)){
      return callback("Unable to find the " + elementsName + " in the " + _parentName);
    }
    itemFound[_parentName] = null;
    this[elementsName].splice(itemIndex, 1);
    return this.saveToDB(function(err, i){
      return itemFound.saveToDB(callback);
    });    
  }.bind(this));
};

module.exports = DataBaseItem;