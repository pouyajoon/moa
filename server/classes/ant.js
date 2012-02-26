var PhysicElement = require ('./physicElement');
var libWorldTools = require('./worldTools');

var mongoose = require('mongoose');

var AntSchema = require('../db/moaSchema.js').AntSchema;
var AntModel = mongoose.model('AntModel', AntSchema);



require('./heritate').implements(AntModel, require("../db/DataBaseItem"), AntModel);

exports.createAnt = function(callback){
	var ant = new AntModel();
	return ant.setup(callback);
}

exports.createAntFromInventory = function(inventory, callback){
	exports.createAnt(function(err, ant){
		ant.inventory = inventory._id;	
		ant.saveToDB(callback);
	});
};

exports.createAntFromZone = function(zone, callback){
	exports.createAnt(function(err, ant){
		ant.zone = zone._id;	
		ant.saveToDB(callback);
	});
};



AntModel.prototype.setup = function(callback) {	
	this.saveToDB(callback);
};



var Ant = function(_position, _size, callback){
  //require('./heritate').heritate(this, Ant, PhysicElement, _position, _size);
  require('./heritate').heritate(this, Ant, require("../db/DataBaseItem"), AntModel);
  this.data.position = {"x" : _position.x, "y" : _position.y};
  this.data.size = _size;
  this.data.action = 'move';
  this.data.angle = 0;
  this.data.direction = 0;
  //this.data.smellDistance = 100;  
  this.colony = null;

  this.saveToDB(function(err, _ant){
  	if (err) callback(err, null);
  	return callback(null, _ant);
  }.bind(this));
}


Ant.prototype.play = function(currentZone){
		// check collision with antionNodes
		//var ant = this;
		// for (var j = 0; j < currentZone.actionNodes.length; ++j){
		// 	var aNode = currentZone.actionNodes[j];
		// 	if (libWorldTools.doCollide(ant.getSmellBox(), aNode.getContactBox())) {
		// 		ant.data.action = aNode.type;
		// 		break;									
		// 	}
		// }		
		// digg a colony ?
		// if (this.data.action == "digg") {
		// 	if (this.data.colony == null) {
		// 		//ant.createColony();			
		// 		this.data.action = 'idle';
		// 	}
		// }	
		// roam if required
		//console.log("play ant ", this.data.position);
		if (this.data.action == "move") {
			var move = 4;				
			this.roam(move);
		}
		this.saveToDB(function(err){});
}

Ant.prototype.shouldBeDeleted = function(){
	//if (ant.position.y + move < 0 || ant.position.x + move < 0)
	//if (ant.position.y + move >global.worldSize.x || ant.position.x + move > global.worldSize.y)	
	return false;
}
Ant.prototype.greet= function(message) {
  return "Hello, I am at " + this.data.position;
}
Ant.prototype.toString = function () {
	return "Ant @ " + this.data.position;
}
// Ant.prototype.getDrawArray = function(drawPosition){
// 	return {
// 		'action' : this.action,
// 		'uID' : this.uniqueID, 
// 		'w' : this.size.w,
// 		'h' : this.size.h,			
// 		'dX' : drawPosition.dX, 
// 		'dY' : drawPosition.dY
// //			'smellBox' : get
// 	};
// }
Ant.prototype.getSmellBox = function () {
	var position = {'x' : this.data.position.x - this.data.size.w, 'y' : this.data.position.y - this.data.size.h};
	var size = {'w' : this.data.size.w * 3, 'h' : this.data.size.h * 3};
	return this.getBox(position, size);	
}
Ant.prototype.roam = function(_power){
//		_power = 0;
	var _moveToDirection = Math.round(Math.random() * 4);
	 //console.log("direction move : " + _moveToDirection)
	switch (_moveToDirection) {
		case 0 :
			this.data.direction -= 1;
		break;
//			case 1 :
//			break;
		case 2 :
			this.data.direction += 1;
		break;			
	}
	if (this.data.direction < 0) this.data.direction = 7;
	if (this.data.direction > 7) this.data.direction = 0;
	this.moveAccordingDirection(_power);
}
Ant.prototype.goWest = function(_power){
	this.data.position.x -= _power;
	this.data.angle = 180;
  this.data.direction = 4;  	
}
Ant.prototype.goEast = function(_power){

	this.data.position.x += _power;
	this.data.angle = 0;  	
  this.data.direction = 0;    	
}
Ant.prototype.goSouth = function(_power){
	this.data.position.y += _power;
	this.data.angle = 90;  	
  this.data.direction = 2;    	
}
Ant.prototype.goNorth = function(_power){
	this.data.position.y -= _power;
	this.data.angle = 270;  	
  this.data.direction = 6;    	
}
Ant.prototype.goNorthEast = function(_power){
	this.data.position.y -= _power;
	this.data.position.x += _power;  	
	this.data.angle = 315;  	
  this.data.direction = 7;    		
}
Ant.prototype.goSouthEast = function(_power){
	this.data.position.y += _power;
	this.data.position.x += _power;  	
  this.data.direction = 1;    	
	this.data.angle = 45;  		
}
Ant.prototype.goSouthWest = function(_power){
	this.data.position.y += _power;
	this.data.position.x -= _power;  	
  this.data.direction = 3;    	
	this.data.angle = 135;  		
}
Ant.prototype.goNorthWest = function(_power){
	this.data.position.y -= _power;
	this.data.position.x -= _power;  
  this.data.direction = 5;    		
	this.data.angle = 225;  		
}

Ant.prototype.moveAccordingDirection = function(_power){
	this.data.action = 'move';
	var direction = this.data.direction; 
	//console.log("direction to : " + direction, " for ", _power);

	if (direction == 0){
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
}



//module.exports = Ant;