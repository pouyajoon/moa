
//var p = require ('prototype');
var libPE = require ('./physicElement');
var libWorldTools = require('./worldTools');
//// Constructor
//exports.Ant = function(_position) {
//  this.position = _position;
//}
//// properties and methods
//exports.Ant.prototype = {
//  position: [0, 0],
//  greet: function(){
//  	return "Hi, I am at {" + this.position + "}";
//  }
//};

/** new, preferred syntax **/

// properties are directly passed to `create` method



require('prototype');

exports.Ant = Class.create(libPE.PhysicElement, {
	initialize : function(_position, _size){

		var pe = new libPE.PhysicElement(_position, _size);
		this.data = pe.data;
    this.data.direction = 0;
    this.data.smellDistance = 100;
    this.data.action = 'move';
    this.data.colony = null;
    this.data.angle = 0;
	},
	play : function(currentZone){
		// check collision with antionNodes
		var ant = this;
		for (var j = 0; j < currentZone.actionNodes.length; ++j){
			var aNode = currentZone.actionNodes[j];
			if (libWorldTools.doCollide(ant.getSmellBox(), aNode.getContactBox())) {
				ant.data.action = aNode.data.type;
				break;									
			}
		}		
		// digg a colony ?
		if (ant.data.action == "digg") {
			if (ant.data.colony == null) {
				ant.createColony();			
				ant.data.action = 'idle';
			}
		}	
		// roam if required
		if (ant.data.action == "move") {
			var move = 1;				
			ant.roam(move);
		}	
	},
	shouldBeDeleted : function(){
		//if (ant.data.position.y + move < 0 || ant.data.position.x + move < 0)
		//if (ant.data.position.y + move >global.worldSize.x || ant.data.position.x + move > global.worldSize.y)	
		return false;
	},
  greet: function(message) {
    return "Hello, I am at " + this.data.position;
  },
  toString : function () {
  	return "Ant @ " + this.data.position;
  },  
	getDrawArray : function(drawPosition){
		return {
			'action' : this.data.action,
			'uID' : this.data.uniqueID, 
			'w' : this.data.size.w,
			'h' : this.data.size.h,			
			'dX' : drawPosition.dX, 
			'dY' : drawPosition.dY
//			'smellBox' : get
		};
	},
	getSmellBox : function () {
		var position = {'x' : this.data.position.x - this.data.size.w, 'y' : this.data.position.y - this.data.size.h};
		var size = {'w' : this.data.size.w * 3, 'h' : this.data.size.h * 3};
		return this.getBox(position, size);	
	},
	roam : function(_power){
//		_power = 0;
		var _moveToDirection = Math.round(Math.random() * 4);
//		console.log("direction move : " + _moveToDirection)
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
	},
  goWest : function(_power){
  	this.data.position.x -= _power;
  	this.data.angle = 180;
    this.data.direction = 4;  	
  },
  goEast : function(_power){
  	this.data.position.x += _power;
  	this.data.angle = 0;  	
    this.data.direction = 0;    	
  },
  goSouth : function(_power){
  	this.data.position.y += _power;
  	this.data.angle = 90;  	
    this.data.direction = 2;    	
  },
  goNorth : function(_power){
  	this.data.position.y -= _power;
  	this.data.angle = 270;  	
    this.data.direction = 6;    	
	},
	goNorthEast : function(_power){
  	this.data.position.y -= _power;
  	this.data.position.x += _power;  	
  	this.data.angle = 315;  	
    this.data.direction = 7;    		
	},
	goSouthEast : function(_power){
  	this.data.position.y += _power;
  	this.data.position.x += _power;  	
    this.data.direction = 1;    	
  	this.data.angle = 45;  		
	},
	goSouthWest : function(_power){
  	this.data.position.y += _power;
  	this.data.position.x -= _power;  	
    this.data.direction = 3;    	
  	this.data.angle = 135;  		
	},	
	goNorthWest : function(_power){
  	this.data.position.y -= _power;
  	this.data.position.x -= _power;  
    this.data.direction = 5;    		
  	this.data.angle = 225;  		
	},

	moveAccordingDirection : function(_power){
		this.data.action = 'move';
//	console.log("direction to : " + this.direction)
		switch (this.data.direction){
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
});




//exports.Ant = function(_position, _size){
//	  var pe = new lib_PE.PhysicElement(_position, _size);
//	  this.data = pe.data;
//    this.data.direction = 0;
//    this.data.smellDistance = 100;
//    this.data.action = 'move';
//    this.data.colony = null;
//}

//exports.Ant.prototype = {
//  greet: function(message) {
//    return "Hello, I am at " + this.data.position;
//  },
//  toString : function () {
//  	return "Ant @ " + this.data.position;
//  },  
//	getDrawArray : function(drawPosition){
//		return {
//			'action' : this.data.action,
//			'uID' : this.data.uniqueID, 
//			'w' : this.data.size.w,
//			'h' : this.data.size.h,			
//			'dX' : drawPosition.dX, 
//			'dY' : drawPosition.dY
////			'smellBox' : get
//		};
//	},
//	getSmellBox : function () {
//		var position = {'x' : this.data.position.x - this.data.size.w, 'y' : this.data.position.y - this.data.size.h};
//		var size = {'w' : this.data.size.w * 3, 'h' : this.data.size.h * 3};
//		return this.getBox(position, size);	
//	},
//	roam : function(_power){
//		var _moveToDirection = Math.round(Math.random() * 5);
////		console.log("direction move : " + _moveToDirection)
//		switch (_moveToDirection) {
//			case 0 :
//				this.data.direction -= 1;
//			break;
////			case 1 :
////			break;
//			case 2 :
//				this.data.direction += 1;
//			break;			
//		}
//		if (this.data.direction < 0) this.data.direction = 7;
//		if (this.data.direction > 7) this.data.direction = 0;
//		this.moveAccordingDirection(_power);
//	}  
//}






//module.exports = Ant;

//exports.Ant = Class.create(lib_PE.PhysicElement, {
//  initialize: function(_position, _size) {

//  },


//});

////var john = new Pirate('Long John');
////john.say('ahoy matey');
//// -> "Long John: ahoy matey, yarr!"



