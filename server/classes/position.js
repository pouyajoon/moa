
var Position = function(_x, _y){
  this.x = _x;
  this.y = _y;
}

Position.prototype.toString = function() {
  return '{x:' + this.x + ', y:' + this.y + '}';
}


module.exports = Position;