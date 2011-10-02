var p = require ('prototype');

exports.Position = Class.create({
	initialize: function(_x, _y){
		this.x = _x;
		this.y = _y;
	},
	toString : function	()
	{
		return '{x:' + this.x + ', y:' + this.y + '}';
	}
});
