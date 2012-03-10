var PhysicElement = require ('./physicElement');
var libWorldTools = require('./worldTools');
var _ = require("underscore");
var moaSchema = require('../db/moaSchema.js');
var AntModel = moaSchema.AntModel;
var UserModel = moaSchema.UserModel;


exports.createAnt = function(userID, callback){
  var ant = new AntModel();
  return ant.setup(userID, callback);
};

exports.createAntFromInventory = function(inventory, callback){
  exports.createAnt(inventory._user, function(err, ant){
    ant._inventory = inventory._id;
    ant.setup(inventory._user, callback);
  });
};

exports.createAntFromZone = function(zone, userID, position, callback){
  exports.createAnt(userID, function(err, ant){
    ant.position = position;
    ant.setup(userID, function(err, ant){
      return zone.addAnt(ant, callback);
    });
  });
};

AntModel.prototype.setup = function(userID, callback) {
  this._user = userID;
  this.saveToDB(callback);
};

AntModel.prototype.getUser = function(callback) {
  return this.getExternalItem(UserModel, this._user, callback);
};

AntModel.prototype.play = function(){
    // check collision with antionNodes
    //var ant = this;
    // for (var j = 0; j < currentZone.actionNodes.length; ++j){
    //  var aNode = currentZone.actionNodes[j];
    //  if (libWorldTools.doCollide(ant.getSmellBox(), aNode.getContactBox())) {
    //    ant.data.action = aNode.type;
    //    break;
    //  }
    // }
    // digg a colony ?
    // if (this.action == "digg") {
    //  if (this.colony == null) {
    //    //ant.createColony();
    //    this.action = 'idle';
    //  }
    // }
    // roam if required
    //console.log("play ant ", this.position);
    this.action = "move";
    if (this.action == "move") {
      var move = 4;
      this.roam(move);
    }
    this.saveToDB(function(err){});
};


var Ant = function(_position, _size, callback){
  //require('./heritate').heritate(this, Ant, PhysicElement, _position, _size);
  require('./heritate').heritate(this, Ant, require("../db/DataBaseItem"), AntModel);
  this.position = {"x" : _position.x, "y" : _position.y};
  this.size = _size;
  this.action = 'move';
  this.angle = 0;
  this.direction = 0;
  //this.smellDistance = 100;
  this.colony = null;

  this.saveToDB(function(err, _ant){
    if (err) callback(err, null);
    return callback(null, _ant);
  }.bind(this));
};


Ant.prototype.greet= function(message) {
  return "Hello, I am at " + this.position;
};
Ant.prototype.toString = function () {
  return "Ant @ " + this.position;
};
// Ant.prototype.getDrawArray = function(drawPosition){
//  return {
//    'action' : this.action,
//    'uID' : this.uniqueID,
//    'w' : this.size.w,
//    'h' : this.size.h,
//    'dX' : drawPosition.dX,
//    'dY' : drawPosition.dY
// //     'smellBox' : get
//  };
// }
// Ant.prototype.getSmellBox = function () {
//  var position = {'x' : this.position.x - this.size.w, 'y' : this.position.y - this.size.h};
//  var size = {'w' : this.size.w * 3, 'h' : this.size.h * 3};
//  return this.getBox(position, size);
// }
AntModel.prototype.roam = function(_power){
//    _power = 0;
  var _moveToDirection = Math.round(Math.random() * 4);
   //console.log("direction move : " + _moveToDirection)
  switch (_moveToDirection) {
    case 0 :
      this.direction -= 1;
    break;
//      case 1 :
//      break;
    case 2 :
      this.direction += 1;
    break;
  }
  if (this.direction < 0) this.direction = 7;
  if (this.direction > 7) this.direction = 0;
  this.moveAccordingDirection(_power);
};
AntModel.prototype.goWest = function(_power){
  this.position.x -= _power;
  this.angle = 180;
  this.direction = 4;
};
AntModel.prototype.goEast = function(_power){

  this.position.x += _power;
  this.angle = 0;
  this.direction = 0;
};
AntModel.prototype.goSouth = function(_power){
  this.position.y += _power;
  this.angle = 90;
  this.direction = 2;
};
AntModel.prototype.goNorth = function(_power){
  this.position.y -= _power;
  this.angle = 270;
  this.direction = 6;
};
AntModel.prototype.goNorthEast = function(_power){
  this.position.y -= _power;
  this.position.x += _power;
  this.angle = 315;
  this.direction = 7;
};
AntModel.prototype.goSouthEast = function(_power){
  this.position.y += _power;
  this.position.x += _power;
  this.direction = 1;
  this.angle = 45;
};
AntModel.prototype.goSouthWest = function(_power){
  this.position.y += _power;
  this.position.x -= _power;
  this.direction = 3;
  this.angle = 135;
};
AntModel.prototype.goNorthWest = function(_power){
  this.position.y -= _power;
  this.position.x -= _power;
  this.direction = 5;
  this.angle = 225;
};

AntModel.prototype.moveAccordingDirection = function(_power){
  this.action = 'move';
  var direction = this.direction;
  //console.log("direction to : " + direction, " for ", _power);

  if (direction === 0){
    return this.goEast(_power);
  }
  if (direction == 1){
    return this.goSouthEast(_power);
  }
  if (direction == 2){
    return this.goSouth(_power);
  }
  if (direction == 3){
    return this.goSouthWest(_power);
  }
  if (direction == 4){
    return this.goWest(_power);
  }
  if (direction == 5){
    return this.goNorthWest(_power);
  }
  if (direction == 6){
    return this.goNorth(_power);
  }
  if (direction == 7){
    return this.goNorthEast(_power);
  }
};
