var PhysicElement = require ('./physicElement');


var Colony = function(_position, _queen){
  heritate(this, Colony, PhysicElement, _position, {'w' : 100, 'h' : 100});
  this.queen = _queen;
}

Colony.prototype.getDrawArray = function(drawPosition){
	return {
		'type' : 'colony',
		'uID' : this.uniqueID, 
		'w' : this.size.w,
		'h' : this.size.h,			
		'dX' : drawPosition.dX, 
		'dY' : drawPosition.dY,
	};  	
}


module.exports = Colony;