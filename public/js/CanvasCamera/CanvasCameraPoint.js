var Point = function(){
	this.x = 0;
	this.y = 0;
}


Point.prototype.toString = function() {
	return '{x:' + this.x + ', ' + 'y:' + this.y + '}';
};

Point.prototype.copy = function(p) {
	this.x = p.x;
	this.y = p.y;
};

Point.prototype.inverse = function() {
	this.x = -1 * this.x;
	this.y = -1 * this.y;
};


Point.prototype.getDivPoint = function(p) {
	var newP = new Point();
	newP.set(this.x / p.x, this.y / p.y);
	return newP;
};

Point.prototype.multiply = function(p) {
	this.x *= p;
	this.y *= p;
};

Point.prototype.set = function(x, y) {
	this.x = x;
	this.y = y;	
};

Point.prototype.add = function(p) {
	this.x += p.x;
	this.y += p.y;
};

Point.prototype.sub = function(p) {
	this.x -= p.x;
	this.y -= p.y;
};

Point.prototype.reset = function() {
	this.x = 0;
	this.y = 0;
};

Point.prototype.getSub = function(p) {
	return {"x" : this.x - p.x, "y" : this.y - p.y};
};