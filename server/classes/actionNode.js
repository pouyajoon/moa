// Action Node Classe


var lib_PE = require ('./physicElement');
require ('prototype');


// create the action node
exports.ActionNode = Class.create(lib_PE.PhysicElement, {
  initialize : function(_type, _position) {
    var pe = new lib_PE.PhysicElement(_position, {'w' : 20, 'h' : 20});
    this.data = pe.data;
    this.data.type = _type;
    console.log(this.greet());
  },
  // when the action node should play
  play : function () {
    this.reduce();
  },
  // if the object should be delete
  shouldBeDeleted : function (){
    return this.data.size.w <= 0 || this.data.size.h <= 0;
  },
  // redefine the greet method
  greet: function() {
    return "Hi, I am a new node " + this.data.type + " @ " + this.data.position;
  },
  toString : function () {
    return "Node " + this.data.type + " @ " + this.data.position;
  },
  reduce : function(){
    this.data.size.w--;
    this.data.size.h--;
//    console.log('reducing node : ' + this.data.size.w);
  },
  getDrawArray : function(drawPosition){
    return {
      'type' : this.data.type,
      'uID' : this.data.uniqueID,
      'w' : this.data.size.w,
      'h' : this.data.size.h,
      'dX' : drawPosition.dX,
      'dY' : drawPosition.dY
    };
  }
});
