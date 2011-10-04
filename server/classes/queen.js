var libAnt = require ('./ant');

exports.Queen = Class.create(libAnt.Ant, {
	initialize: function(_name, _position) {
    var a = new libAnt.Ant(_position, {"w" : 20, "h" : 20});
  	this.data = a.data;
  	this.data.name = _name;
	},
	geet: function() {
    return "Hi, I am the queen " + this.data.name + " @ " + this.data.position + ", my direction is " + this.data.direction;
  },
  toString : function () {
  	return "Queen " + this.data.name + " @ " + this.data.position;
  }, 
  createColony : function(){
  	var c = new lib_colony.Colony({'x' : this.data.position.x, 'y' : this.data.position.y}, this);  	
  	this.data.colony = c;
  	//global.staticElements.push(c);
  } 
});
