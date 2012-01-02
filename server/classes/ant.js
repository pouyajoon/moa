var PhysicElement = require ('./physicElement');
var libWorldTools = require('./worldTools');


var Ant = function(_position, _size){
  require('./heritate').heritate(this, Ant, PhysicElement, _position, _size);
  this.direction = 0;
  this.smellDistance = 100;
  this.action = 'move';
  this.colony = null;
  this.angle = 0;
}


Ant.prototype.play = function(currentZone){
		// check collision with antionNodes
		var ant = this;
		for (var j = 0; j < currentZone.actionNodes.length; ++j){
			var aNode = currentZone.actionNodes[j];
			if (libWorldTools.doCollide(ant.getSmellBox(), aNode.getContactBox())) {
				ant.action = aNode.type;
				break;									
			}
		}		
		// digg a colony ?
		if (ant.action == "digg") {
			if (ant.colony == null) {
				ant.createColony();			
				ant.action = 'idle';
			}
		}	
		// roam if required
		if (ant.action == "move") {
			var move = 4;				
			ant.roam(move);
		}	
}

Ant.prototype.shouldBeDeleted = function(){
	//if (ant.position.y + move < 0 || ant.position.x + move < 0)
	//if (ant.position.y + move >global.worldSize.x || ant.position.x + move > global.worldSize.y)	
	return false;
}
Ant.prototype.greet= function(message) {
  return "Hello, I am at " + this.position;
}
Ant.prototype.toString = function () {
	return "Ant @ " + this.position;
}
Ant.prototype.getDrawArray = function(drawPosition){
	return {
		'action' : this.action,
		'uID' : this.uniqueID, 
		'w' : this.size.w,
		'h' : this.size.h,			
		'dX' : drawPosition.dX, 
		'dY' : drawPosition.dY
//			'smellBox' : get
	};
}
Ant.prototype.getSmellBox = function () {
	var position = {'x' : this.position.x - this.size.w, 'y' : this.position.y - this.size.h};
	var size = {'w' : this.size.w * 3, 'h' : this.size.h * 3};
	return this.getBox(position, size);	
}
Ant.prototype.roam = function(_power){
//		_power = 0;
	var _moveToDirection = Math.round(Math.random() * 4);
//		console.log("direction move : " + _moveToDirection)
	switch (_moveToDirection) {
		case 0 :
			this.direction -= 1;
		break;
//			case 1 :
//			break;
		case 2 :
			this.direction += 1;
		break;			
	}
	if (this.direction < 0) this.direction = 7;
	if (this.direction > 7) this.direction = 0;
	this.moveAccordingDirection(_power);
}
Ant.prototype.goWest = function(_power){
	this.position.x -= _power;
	this.angle = 180;
  this.direction = 4;  	
}
Ant.prototype.goEast = function(_power){
	this.position.x += _power;
	this.angle = 0;  	
  this.direction = 0;    	
}
Ant.prototype.goSouth = function(_power){
	this.position.y += _power;
	this.angle = 90;  	
  this.direction = 2;    	
}
Ant.prototype.goNorth = function(_power){
	this.position.y -= _power;
	this.angle = 270;  	
  this.direction = 6;    	
}
Ant.prototype.goNorthEast = function(_power){
	this.position.y -= _power;
	this.position.x += _power;  	
	this.angle = 315;  	
  this.direction = 7;    		
}
Ant.prototype.goSouthEast = function(_power){
	this.position.y += _power;
	this.position.x += _power;  	
  this.direction = 1;    	
	this.angle = 45;  		
}
Ant.prototype.goSouthWest = function(_power){
	this.position.y += _power;
	this.position.x -= _power;  	
  this.direction = 3;    	
	this.angle = 135;  		
}
Ant.prototype.goNorthWest = function(_power){
	this.position.y -= _power;
	this.position.x -= _power;  
  this.direction = 5;    		
	this.angle = 225;  		
}

Ant.prototype.moveAccordingDirection = function(_power){
	this.action = 'move';
//	console.log("direction to : " + this.direction)
	switch (this.direction){
		case 0 : 
			this.goEast(_power);
		break;
		case 1 : 
			this.goSouthEast(_power);
		break;		
		case 2 : 
			this.goSouth(_power);
		break;		
		case 3 : 
			this.goSouthWest(_power);
		break;
		case 4 : 
			this.goWest(_power);
		break;			
		case 5 : 
			this.goNorthWest(_power);
		break;			
		case 6 : 
			this.goNorth(_power);
		break;			
		case 7 : 
			this.goNorthEast(_power);
		break;			
		

	}
}



module.exports = Ant;