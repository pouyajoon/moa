exports.heritate = function (_instance, _child, _parent){
  _parent.apply(_instance, Array.prototype.slice.call(arguments, 3));
  for (var a in _parent.prototype){
    if (typeof _child.prototype[a] === "undefined"){
      _child.prototype[a] = _parent.prototype[a];
    }
  }
}