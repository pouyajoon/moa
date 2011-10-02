exports.Zone = function(_x, _y) {

		this.id = _x + '_' + _y;
		this.x = _x;
		this.y = _y;
		this.ants = new Array();
		this.actionNodes = new Array();
		console.log('creating zone ' + this.id);			
}



