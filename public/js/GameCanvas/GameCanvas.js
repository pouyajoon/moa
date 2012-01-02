var GameCanvas = function(_worldMap, _tileCoordinate, callback){
  this.worldMap = _worldMap;
  this.tileCoordinate = _tileCoordinate;
  
  this.backgroundSize = 512;

  var _imgUrl = this.worldMap.getImageURLFromTileCoordinate(this.tileCoordinate);
  var _mainImgUrl = _imgUrl + '&size=' + this.backgroundSize + 'x' + this.backgroundSize + '&scale=2';

  this.backgroundImage = new Image();
  this.backgroundImage.src = _mainImgUrl;

  $("#mainScreen").click(function(){
    
  }.bind(this));

  //initActionNodes();

  this.ants = [];
  this.worldMap.socketManager.emit("getzone", this.tileCoordinate.x + "_" + this.tileCoordinate.y);
  this.worldMap.socketManager.on('zone', function (dataZone) {
    //console.log('ants', dataZone.ants);
    this.ants = dataZone.ants;
  }.bind(this));

  this.canvasID = "mainScreen";
  this.canvas = document.getElementById(this.canvasID);
  
  this.ctx = this.canvas.getContext('2d');
  this.ctx.canvas.width = $(this.canvas).width();
  this.ctx.canvas.height = $(this.canvas).height();  

  this.drawZoneSize = {"w" : 4096, "h" : 4096};

  this.camera = new CanvasCamera(this.canvas, this.drawZoneSize);
  this.camera.scaleMax = this.drawZoneSize.w / this.worldMap.TILE_SIZE;
  this.camera.scale = this.camera.scaleMax;
  this.camera.scaleFactor = 0.25;
  this.camera.scaleNum = 1;

  this.camera.initialTranslate.set(this.canvas.width / 2 - this.worldMap.TILE_SIZE / 2, this.canvas.height / 2 - this.worldMap.TILE_SIZE / 2);
  this.camera.translate.copy(this.camera.initialTranslate);
  
  this.camera.scaleIsMoreThanScaleMax = function(_camera){
    if (_camera.translate.equals(_camera.initialTranslate, 10)){
      _camera.translate = _camera.initialTranslate;
      console.log('close');
      this.worldMap.show(0);      
      this.close(250);    
      return false;  
    } else {
      var diff = _camera.translate.getSubPoint(_camera.initialTranslate);
      diff.div(3);
      _camera.translate.sub(diff);
    }
    return true;
  }.bind(this);  
  callback(this);

  this.tickInterval = setInterval(function(){
    this.tick();  
  }.bind(this), 1000 / 12);  
}

GameCanvas.prototype.getZoneID = function() {
  return this.tileCoordinate.x + "_" + this.tileCoordinate.y;
};

GameCanvas.prototype.close = function(_time) {
  clearInterval(this.tickInterval);
  this.camera.close();
  this.worldMap.socketManager.emit("stopzone", this.getZoneID());
  this.hide(_time);
};

GameCanvas.prototype.hide = function(_time) {
  $("#mainScreen").fadeOut(_time);
};
GameCanvas.prototype.show = function(_time) {
  $("#mainScreen").fadeIn(_time);
};

GameCanvas.prototype.tick = function() {
  //requestAnimFrame(this.tick.bind(this));
  this.camera.update();
    
  this.camera.debug();
  this.camera.clearContext(this.ctx);

  this.ctx.save();  
  this.camera.transform(this.ctx);
  
  var _halfSize = new Point();
  _halfSize.set(this.drawZoneSize.w / 2, this.drawZoneSize.h / 2);
  this.ctx.drawImage(this.backgroundImage, - _halfSize.x , - _halfSize.y, this.drawZoneSize.w * 2, this.drawZoneSize.h * 2);

  this.ctx.strokeStyle = "#000";
  this.ctx.strokeRect(0, 0, this.drawZoneSize.w, this.drawZoneSize.h);

  this.drawAnts();
  
  this.ctx.restore();
};

GameCanvas.prototype.drawAnts = function() {
    this.ctx.fillStyle = "rgb(60,60,60)";
  _.each(this.ants, function(ant){

    var image = imgAIdle;
    if (ant.action == "move") { image = imgAMove; }
    //if (ant.action == "digg") { image = imgADigg; } 
    // this.ctx.strokeRect(ant.position.x, ant.position.y, ant.size.w, ant.size.h); 
    //this.ctx.drawImage(image, ant.position.x, ant.position.y, ant.size.w, ant.size.h); 
    //if (isInDrawScreen(ant.position, this.camera)){
    this.ctx.save();     
    this.ctx.translate(ant.position.x + (ant.size.w / 2), ant.position.y + (ant.size.h / 2));
    this.ctx.rotate(ant.angle * Math.PI / 180);      
    this.ctx.drawImage(image, - ant.size.w / 2, - ant.size.h / 2, ant.size.w, ant.size.h); 
    this.ctx.restore();    
    //}
  }.bind(this));
};