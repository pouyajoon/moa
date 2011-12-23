var GameCanvas = function(_worldMap, _socketManager, _tileCoordinate, callback){
  this.worldMap = _worldMap;
  this.tileCoordinate = _tileCoordinate;

  
  var _imgUrl = this.worldMap.getImageURLFromTileCoordinate(this.tileCoordinate);
  var _mainImgUrl = _imgUrl + '&size=512x512&scale=2';

  this.backgroundImage = new Image();
  this.backgroundImage.src = _mainImgUrl;

  this.miniMap = new MiniMap('navigationRight');

  this.miniMap.setBackgroundImage(_mainImgUrl);

  console.log(_mainImgUrl);


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

  this.camera = new CanvasCamera(this.canvas);
  this.camera.scale = 6;
  callback(this);

  this.tick();
}


GameCanvas.prototype.tick = function() {

    requestAnimFrame(this.tick.bind(this));
    this.camera.update();
    this.camera.debug();
    this.camera.clearContext(this.ctx);


    this.ctx.save();  
    this.camera.transform(this.ctx);

    this.ctx.strokeStyle = "#000";
    this.ctx.strokeRect(0, 0, 4096, 4096);

    this.ctx.drawImage(this.backgroundImage, 0, 0, 4096, 4096);
    _.each(this.ants, function(ant){
      //console.log(ant);
      this.ctx.fillRect(ant.data.position.x, ant.data.position.y, ant.data.size.w, ant.data.size.h);
    }.bind(this));

    
    this.ctx.restore();
};