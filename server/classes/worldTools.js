var lib_position = require ('./position');


exports.isInDrawScreen = function(position, floatCamera){
  var antIsInX = (position.x >= floatCamera.traX) && (position.x <= floatCamera.maxX);
  var antIsInY = (position.y >= floatCamera.traY) && (position.y <= floatCamera.maxY);
  return antIsInX && antIsInY;
};



exports.transformToRealPosition = function(drawPosition, floatCamera) {
  var x = (drawPosition.x / floatCamera.worldInitX) * floatCamera.ScreenWidth + floatCamera.traX;
  var y = (drawPosition.y / floatCamera.worldInitY) * floatCamera.ScreenHeight + floatCamera.traY;
  return new lib_position.Position(x, y);
};

// define the new position
exports.transformToScreenPosition = function(position, floatCamera) {
    var dX = ((position.x - floatCamera.traX) / floatCamera.ScreenWidth) * floatCamera.worldInitX;
//      var dX = (position.x - floatCamera.traX) * floatCamera.worldZoomLevel;
//    if (floatCamera.traX == 0) {
//      dX = (position.x / floatCamera.ScreenWidth) * floatCamera.worldInitX;
//    }
    var dY = ((position.y - floatCamera.traY) / floatCamera.ScreenHeight) * floatCamera.worldInitY;
//      var dY = (position.y - floatCamera.traY) * floatCamera.worldZoomLevel;
//    if (floatCamera.traY == 0) {
//      dY = (position.y / floatCamera.ScreenHeight) * floatCamera.worldInitY;
//    }
    return {'dX' : dX, 'dY' : dY};
};


// return true if the two provided boxes have collision
exports.doCollide = function(box1, box2){

    var contactX = false;
    var contactY = false;

    // if obj2 est à droite de obj1
    if (box2.x > box1.x) {
      contactX = Math.abs(box2.x - box1.x) <= box1.w;
    }
    else {
      contactX = Math.abs(box2.tr - box1.x) <= box1.w;
    }

    // if obj2 est en dessous de obj1
    if (box2.y > box1.y) {
      contactY = Math.abs(box2.y - box1.y) <= box1.h;
    }
    else {
      contactY = Math.abs(box2.br - box1.y) <= box1.h;
    }

    return contactX && contactY;
};

