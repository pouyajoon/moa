var _ = require('underscore');

exports.heritate = function (_instance, _child, _parent){
  _parent.apply(_instance, Array.prototype.slice.call(arguments, 3));
  for (var a in _parent.prototype){
    if (typeof _child.prototype[a] === "undefined"){
      _child.prototype[a] = _parent.prototype[a];
    }
  }
}

exports.implements = function (_child, _parent){
  if (_.isUndefined(_child.prototype)){
    for (var a in _parent.__proto__){
      if (_.isFunction(_parent.__proto__[a]) && _.isUndefined(_child.__proto__[a])){
        _child.__proto__[a] = _parent.__proto__[a];
      }
    }
  } else {
    for (var a in _parent.prototype){
      if (_.isUndefined(_child.prototype[a])){
        _child.prototype[a] = _parent.prototype[a];
      }
    }
  }
}