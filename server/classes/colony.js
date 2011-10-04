var lib_PE = require ('./physicElement');


var Colony = function(_position, _queen){
  var pe = new lib_PE.PhysicElement(_position, {'w' : 100, 'h' : 100});
  this.data = pe.data;
  this.data.queen = _queen;
}

Colony.prototype = {
getDrawArray : function(drawPosition){
		return {
			'type' : 'colony',
			'uID' : this.data.uniqueID, 
			'w' : this.data.size.w,
			'h' : this.data.size.h,			
			'dX' : drawPosition.dX, 
			'dY' : drawPosition.dY,
//			'smellBox' : get
		};  	
  }
}


module.exports = Colony;