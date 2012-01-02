
var PhysicElement = function(_position, _size){
	  this.position = _position;
	  this.uniqueID = global.uniqueID;
		this.size = _size;    
	  global.uniqueID++;	
}

PhysicElement.prototype.getBox = function(_position, _size){
	return {
		'x' : _position.x, 
		'y' : _position.y, 
		'w' : _size.w, 
		'h' : _size.h,
		'tr' : _position.x + _size.w,
		'tb' : _position.y + _size.y
	};
}

PhysicElement.prototype.getContactBox = function() {
	return this.getBox(this.position, this.size);
}

module.exports = PhysicElement;


