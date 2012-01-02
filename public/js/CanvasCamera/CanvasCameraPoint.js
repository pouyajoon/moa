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


Point.prototype.div = function(divider) {
	this.x /= divider;
	this.y /= divider;
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

Point.prototype.getSubPoint = function(p) {
	var newP = new Point();
	newP.set(this.x, this.y);
	newP.sub(p)
	return newP;
};

Point.prototype.equals = function(p, distance) {
	if (Math.abs(p.x - this.x) > distance) return false;
	if (Math.abs(p.y - this.y) > distance) return false;
	return true;
};