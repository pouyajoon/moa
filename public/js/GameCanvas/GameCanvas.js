var GameCanvas = function(_worldMap, _socketManager, _tileCoordinate, callback){
  this.worldMap = _worldMap;
  this.tileCoordinate = _tileCoordinate;

  
  var _imgUrl = this.worldMap.getImageURLFromTileCoordinate(this.tileCoordinate);
  var _mainImgUrl = _imgUrl + '&size=512x512&scale=2';

  this.backgroundImage = new Image();
  this.backgroundImage.src = _mainImgUrl;

  //this.miniMap = new MiniMap('navigationRight');
  //this.miniMap.hide();

  
  //this.miniMap.setBackgroundImage(_mainImgUrl);

  //console.log(_mainImgUrl);


  this.ants = [];

  _socketManager.emit("getzone", this.tileCoordinate.x + "_" + this.tileCoordinate.y);
  _socketManager.on('zone', function (dataZone) {
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
  this.camera.scale = 6;
  this.camera.scaleFactor = 0.25;
  callback(this);


  setInterval(function(){
    this.tick();  
  }.bind(this), 1000 / 12);
  
}


GameCanvas.prototype.show = function() {
  $("#mainScreen").fadeIn(250);
};

GameCanvas.prototype.tick = function() {
    //requestAnimFrame(this.tick.bind(this));    
    this.camera.update();
    this.camera.debug();
    this.camera.clearContext(this.ctx);

    this.ctx.save();  
    this.camera.transform(this.ctx);
    this.ctx.strokeStyle = "#000";
    this.ctx.strokeRect(0, 0, this.drawZoneSize.w, this.drawZoneSize.h);

    this.ctx.drawImage(this.backgroundImage, 0, 0, this.drawZoneSize.w, this.drawZoneSize.h);

    this.drawAnts();
    
    this.ctx.restore();

};

GameCanvas.prototype.drawAnts = function() {
    this.ctx.fillStyle = "rgb(60,60,60)";
  _.each(this.ants, function(antD){
    var ant = antD.data;
    
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