
var PhysicElement = function(_position, _size){
		//require('./heritate').heritate(this, PhysicElement, require("../db/DataBaseItem"), new PhysicElementModel());
		this.data = {};
		this.data.position = _position;
		this.data.size = _size;
		this.uniqueID = global.uniqueID;
		global.uniqueID++;
};

PhysicElement.prototype.getBox = function(_position, _size){
	return {
		'x' : _position.x,
		'y' : _position.y,
		'w' : _size.w,
		'h' : _size.h,
		'tr' : _position.x + _size.w,
		'tb' : _position.y + _size.y
	};
};

PhysicElement.prototype.getContactBox = function() {
	return this.getBox(this.data.position, this.data.size);
};

module.exports = PhysicElement;


