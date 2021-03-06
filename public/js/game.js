

var Game = function(callback){
  // setup world
  this.currentGameCanvas = null;
  this.socketManager = new SocketManager(this, MOA_SERVER);

  this.inventory = new Inventory(this);
  this.inventory.draw();

  // une worldmap
  new WorldMap(function(_worldMap){
    console.log("world map created");
    this.worldMap = _worldMap;
    this.worldMap.onClickInMap = this.onClickInMap.bind(this);
    return callback(null, this);
  }.bind(this));

};

Game.prototype.emitSocket = function(name, data, callback) {
  this.socketManager.emit(name, data, callback);
};

Game.prototype.bindOnSocket = function(event, callback) {
  this.socketManager.on(event, callback);
};

Game.prototype.unbindOnSocket = function(event) {
  this.socketManager.unbind(event);
};

Game.prototype.showGameCanvas = function(event, tileCoordinate, tileCoordinatePos) {
  console.log(this.gameCanvas);
  var zoneID = tileCoordinate.x + "_" + tileCoordinate.y;
  this.currentGameCanvas = new GameCanvas(this, tileCoordinate);
  this.currentGameCanvas.camera.initialTranslate.set(event.pixel.x - tileCoordinatePos.x, event.pixel.y - tileCoordinatePos.y);
  this.currentGameCanvas.camera.translate.copy(this.currentGameCanvas.camera.initialTranslate);
  this.currentGameCanvas.show(500);
  this.socketManager.emit("getZone", tileCoordinate.x + "_" + tileCoordinate.y);
  this.inventory.enableAntsDraggable(this.currentGameCanvas);
};

Game.prototype.hideGameCanvas = function() {
  this.worldMap.show(250, this.currentGameCanvas.tileCoordinate);
  this.currentGameCanvas.close(250);
  var zoneID = this.currentGameCanvas.getZoneID();
  this.socketManager.emit("stopzone", zoneID);
  this.inventory.disableAntsDraggable();
  this.currentGameCanvas = null;
};

Game.prototype.onClickInMap = function(event, tileCoordinate, tileCoordinatePos) {
  this.showGameCanvas(event, tileCoordinate, tileCoordinatePos);
};


// ANTS
var imgAMove = new Image();
imgAMove.src='/images/ant.gif';
var imgADigg = new Image();
imgADigg.src='/images/aDigg.gif';
var imgAIdle = new Image();
imgAIdle.src='/images/aIdle.gif';

// TREE
var imgTree = new Image();
imgTree.src='/images/tree.gif';

// HOME
var imgHome = new Image();
imgHome.src='/images/home.gif';


var game = {
  'currentZone' : null,
  'numberOfAnts' : 0,
  'setAction' : 'none'
};

function getAntInfo(ant){
  var antInfo = ant.data('antInfo');
  var info = 'Name : ' + antInfo.name + '<br/>';
  info += 'Position : [' + antInfo.position.x +','+ antInfo.position.y + ']<br/>' + 'Draw Position : [' + antInfo.drawPosition.x + ', ' + antInfo.drawPosition.y + ']';
}


function drawStaticElements(ctx, data) {
  $.each(data.localStatics, function(i, staticElement){
    var w = staticElement.w / camera.worldZoomLevel;
    var h = staticElement.h / camera.worldZoomLevel;
    if (staticElement.type == "colony") {
      ctx.drawImage(imgHome, staticElement.dX, staticElement.dY, w, h);

    }
//    ctx.fillStyle = $('#setAction_' + actionNode.type).data('color');
//    if (actionNode.type == "follow") ctx.fillStyle = "rgb(0,0,255)";
//    ctx.fillRect (actionNode.dX, actionNode.dY, w, h);
  });
}

function drawActionNodes(ctx, actionNodes) {
//  console.log('AN:');
//  console.log(actionNodes);
  $.each(actionNodes, function(i, a){

//    console.log("AN IN");
//    console.log(a);
    var w = a.data.size.w / camera.worldZoomLevel;
    var h = a.data.size.h / camera.worldZoomLevel;
    if (isInDrawScreen(a.data.position)){
      var dX = ((a.data.position.x - camera.translateX) / camera.ScreenSize.w) * camera.worldInitX;
      var dY = ((a.data.position.y - camera.translateY) / camera.ScreenSize.h) * camera.worldInitY;
      ctx.fillStyle = $('#setAction_' + a.data.type).data('color');
      ctx.fillRect (dX, dY, w, h);
    }
  });

//  $.each(actionNodes.data, function(i, actionNode){
//    console.log('AN:');
//    console.log(actionNode);
////    var w = actionNode.size.w / camera.worldZoomLevel;
////    var h = actionNode.size.h / camera.worldZoomLevel;
////    ctx.fillStyle = $('#setAction_' + actionNode.type).data('color');
//////    if (actionNode.type == "follow") ctx.fillStyle = "rgb(0,0,255)";
////    ctx.fillRect (actionNode.position.x, actionNode.position.y, w, h);
//  });
}

function drawBigMap(ctxBigMap, data) {
//  console.log(data);
//  if (data != null && data.length == 0) return;

  ctxBigMap.fillStyle = "rgb(0,255,0)";
  ctxBigMap.canvas.width  = camera.miniMapSize;
  ctxBigMap.canvas.height = camera.miniMapSize;
  ctxBigMap.clearRect(0, 0, camera.miniMapSize, camera.miniMapSize);

  $.each(data, function(i, ant){
    var xSize = ant.data.size.w / camera.worldMaxSize.x * camera.miniMapSize;
    var ySize = ant.data.size.h / camera.worldMaxSize.y * camera.miniMapSize;
    var xMap = (ant.data.position.x / camera.worldMaxSize.x) * camera.miniMapSize;
    var yMap = (ant.data.position.y / camera.worldMaxSize.y) * camera.miniMapSize;
    ctxBigMap.fillRect (xMap, yMap, xSize, ySize);
  });
}

function isInDrawScreen(position, camera){
  var antIsInX = (position.x >= camera.translateX) && (position.x <= camera.ScreenSize.w + camera.translateX);
  var antIsInY = (position.y >= camera.translateY) && (position.y <= camera.ScreenSize.h + camera.translateY);
  return antIsInX && antIsInY;
}

function drawAnts(ctx, data) {
  ctx.fillStyle = "rgb(60,60,60)";
  $.each(data, function(i, antD){
    var ant = antD.data;
    var w = ant.size.w / camera.worldZoomLevel;
    var h = ant.size.h / camera.worldZoomLevel;
//    ctx.fillRect (ant.dX, ant.dY, w, h);
    var image = imgAIdle;
    if (ant.action == "move") { image = imgAMove; }
    if (ant.action == "digg") { image = imgADigg; }
    if (isInDrawScreen(ant.position)){
      ctx.save();
      ctx.translate(ant.position.x + (ant.size.w / 2), ant.position.y + (ant.size.h / 2));
      ctx.rotate(ant.angle * Math.PI / 180);
      ctx.drawImage(image, - ant.size.w / 2, - ant.size.h / 2, ant.size.w, ant.size.h);
      ctx.restore();
    }
//    if (ant.action == "idle") { image = imgAMove; }

  });
}

