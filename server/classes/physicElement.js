
require('prototype');


exports.PhysicElement = Class.create();
exports.PhysicElement.prototype = {
	initialize : function(_position, _size){
			this.data = {};
		  this.data.position = _position;
		  this.data.uniqueID = global.uniqueID;
			this.data.size = _size;    
		  global.uniqueID++;
	},
	getBox : function(_position, _size){
		return {
			'x' : _position.x, 
			'y' : _position.y, 
			'w' : _size.w, 
			'h' : _size.h,
			'tr' : _position.x + _size.w,
			'tb' : _position.y + _size.y
		};
	},
	getContactBox : function() {
		return this.getBox(this.data.position, this.data.size);
	}
}



