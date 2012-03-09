var GameCanvas = function(_game, _tileCoordinate){
  console.log("new game canvas");
  this.game = _game;
  this.tileCoordinate = _tileCoordinate;

  this.backgroundSize = 512;

  var _imgUrl = this.game.worldMap.getImageURLFromTileCoordinate(this.tileCoordinate);
  var _mainImgUrl = _imgUrl + '&size=' + this.backgroundSize + 'x' + this.backgroundSize + '&scale=2';

  this.backgroundImage = new Image();
  this.backgroundImage.src = _mainImgUrl;

  $("#mainScreen").click(function(){

  }.bind(this));

  //initActionNodes();

  this.ants = [];

  this.game.bindOnSocket('zone', function (dataZone) {
    //console.log('ants', dataZone.ants);
    this.ants = dataZone.ants;
  }.bind(this));

  this.game.bindOnSocket('ant', function (antMessage) {
    //console.log('ants', dataZone.ants);
    console.log('antMessage', antMessage);
    if (antMessage.err) console.log(antMessage.err);

    new AntInfoBox(this.game.socketManager, antMessage);
    // $('.ant-details').remove();
    // $("body").append('<div class="ant-details"><ul><li>' + antMessage.ant.action + '</li><li>' + antMessage.user.email + '</li></ul></div>');
  }.bind(this));

  this.canvasID = "mainScreen";
  this.canvas = document.getElementById(this.canvasID);

  this.ctx = this.canvas.getContext('2d');
  this.ctx.canvas.width = $(this.canvas).width();
  this.ctx.canvas.height = $(this.canvas).height();

  this.drawZoneSize = {"w" : 4096, "h" : 4096};

  this.camera = new CanvasCamera(this.canvas, this.drawZoneSize);
  this.camera.scaleMax = this.drawZoneSize.w / TILE_SIZE;
  this.camera.scale = this.camera.scaleMax;
  this.camera.scaleFactor = 0.25;
  this.camera.scaleNum = 1;

  this.camera.initialTranslate.set(this.canvas.width / 2 - TILE_SIZE / 2, this.canvas.height / 2 - TILE_SIZE / 2);
  this.camera.translate.copy(this.camera.initialTranslate);


  this.selectedAnt = null;
  $(this.camera.canvas).click(function(event){
    this.camera.mouseMove(event);
    this.selectedAnt = this.clickedOnAnt();
    if (this.selectedAnt !== null){
      this.game.emitSocket('getAnt', this.selectedAnt._id);
    } else {
      $('.antInfoBox').remove();
    }
  }.bind(this));

  this.camera.scaleIsMoreThanScaleMax = function(_camera){
    if (_camera.translate.equals(_camera.initialTranslate, 10)){
      _camera.translate = _camera.initialTranslate;
      //console.log('close');
      this.game.hideGameCanvas();
      return false;
    } else {
      var diff = _camera.translate.getSubPoint(_camera.initialTranslate);
      diff.div(3);
      _camera.translate.sub(diff);
    }
    return true;
  }.bind(this);
  this.tickInterval = setInterval(function(){
    this.tick();
  }.bind(this), 1000 / 12);
};


GameCanvas.prototype.clickedOnAnt = function() {
  var selectedAnt = null;
  _.each(this.ants, function(ant){
    if (this.camera.mouseInDrawZone.isInside(ant.position, ant.size))
    {
      selectedAnt = ant;
      return false;
    }
  }.bind(this));
  return selectedAnt;
};

GameCanvas.prototype.getZoneID = function() {
  return this.tileCoordinate.x + "_" + this.tileCoordinate.y;
};

GameCanvas.prototype.close = function(_time) {
  clearInterval(this.tickInterval);
  this.camera.close();
  this.game.unbindOnSocket("zone");
  this.game.unbindOnSocket("ant");
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
  //console.log('tick')
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
    //console.log(ant);
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
    if (this.selectedAnt !== null && this.selectedAnt._id == ant._id){
      this.ctx.strokeStyle = "rgb(0, 0, 0)";
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 50, 0, 2 * Math.PI, false);
      this.ctx.stroke();
      this.ctx.closePath();
//      this.ctx.strokeRect(- ant.size.w / 2, - ant.size.h / 2, ant.size.w, ant.size.h);
    }
    this.ctx.restore();
    // this.ctx.strokeStyle = "rgb(255, 0, 0)";
    // this.ctx.strokeRect(ant.position.x , ant.position.y, ant.size.w, ant.size.h);

    //}
  }.bind(this));
};