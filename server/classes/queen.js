var Ant = require ('./ant');

var Queen = function(_name, _position) {
  require('./heritate').heritate(this, Queen, Ant, _position, {"w" : 50, "h" : 50});
  this.name = _name;
}

Queen.prototype.geet= function() {
  return "Hi, I am the queen " + this.name + " @ " + this.position + ", my direction is " + this.direction;
}

Queen.prototype.toString = function () {
	return "Queen " + this.name + " @ " + this.position + "|";
}
 
Queen.prototype.createColony = function(){
	var c = new lib_colony({'x' : this.position.x, 'y' : this.position.y});  	
	this.colony = c;
	//global.staticElements.push(c);
} 

module.exports = Queen;