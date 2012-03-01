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

  //_parent.apply(_instance, Array.prototype.slice.call(arguments, 3));
  //if (_.isUndefined(_child)) return;
  //if (_.isUndefined(_parent)) return;
  if (_.isUndefined(_child.prototype)){
    //console.log("CHILD HAS NO PROTOTYPE", _child.__proto__);
    for (var a in _parent.__proto__){
      //console.log(a.indexOf("zzz"));
      //console.log('a : ', a);
      if (_.isFunction(_parent.__proto__[a]) && _.isUndefined(_child.__proto__[a])){
        //console.log(a);
        _child.__proto__[a] = _parent.__proto__[a];
      }
      
      //if (_.isUndefined(_child[a])){
        
      //}    
    }

  } else {
    for (var a in _parent.prototype){
      //console.log(a);
      if (_.isUndefined(_child.prototype[a])){
        _child.prototype[a] = _parent.prototype[a];
      }
    }

  }
//  console.log("-----------------END");
}