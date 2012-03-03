window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback, element) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();



var CanvasCamera = function(canvas, _drawZoneSize){

	this.canvas = canvas;
	this.canvasMousePosition = {"x" : 0, "y" : 0};
	this.scale = 1;
	this.translate = new Point();
	this.canvasScaledSize = new Point();
	this.focusMouseTranslate = new Point();
	this.mousePosition = new Point();
	this.drawZoneSize = new Point();
	this.drawZoneSize.set(_drawZoneSize.w, _drawZoneSize.h);

  this.initialTranslate = new Point();

  this.scaleNum = 5;

	this.mouseInDrawZone = new Point();
	this.mousePourcentageInDrawZone = new Point();

	this.scaleFactor = 0.05;
  this.scaleMax = 5;

	this.scaledCanvasMousePosition = {"x" : 0, "y" : 0};
	this.mousePourcentagePosition = new Point();

	this.newMousePosition = {"x" : 0, "y" : 0};

	this.tickCount = 0;
  this.tickStart = 0;


	$(this.canvas).mousedown(function(e){
		this.mouseISDown = true;
		this.saveMouseDown = this.canvasMousePosition;
	}.bind(this));
	$(this.canvas).mouseup(function(e){
		this.mouseISDown = false;
	}.bind(this));
	$(this.canvas).mousemove(function(e){
		this.mouseMove(e);
	}.bind(this));	
	$(this.canvas).bind('mousewheel', function(event, delta) {
		this.mouseWheel(event, delta);
		return false;
	}.bind(this));
}

CanvasCamera.prototype.clearContext = function(ctx) {
	var ctxSize = new Point();
	ctxSize.copy(this.canvasScaledSize);
	if (ctxSize.x < this.canvas.width) ctxSize.x = this.canvas.width;
	if (ctxSize.y < this.canvas.height) ctxSize.y = this.canvas.height;

	ctx.clearRect(0, 0, ctxSize.x, ctxSize.y);
};

CanvasCamera.prototype.debug = function() {
   return;
	var output = [];
	output.push("canvassize:", this.canvas.width, ",", this.canvas.height, '<br/>'); 
	
	output.push("translate:", this.translate.x, ",", this.translate.y, '<br/>'); 
	output.push("mousePosition:", this.mousePosition.toString(), ', <br/>');
	output.push("canvasmousepos:", this.canvasMousePosition.x, ",", this.canvasMousePosition.y, '<br/>'); 
	output.push("mouse%pos:", this.mousePourcentagePosition.x, ",", this.mousePourcentagePosition.y,'<br/>');
	output.push("scaledmouse%pos:", this.scaledCanvasMousePosition.x, ",", this.scaledCanvasMousePosition.y,'<br/>');
	output.push("scale:", this.scale, ', ' + 1 / this.scale +'<br/>');
	output.push("canvasScaledSize:", this.canvasScaledSize.toString(), ', <br/>');
	output.push("focusMouseTranslate:", this.focusMouseTranslate.toString(), ', <br/>');
	output.push("mouseInDrawZone:", this.mouseInDrawZone.toString(), ', <br/>');
	output.push("mouse%InDrawZone:", this.mousePourcentageInDrawZone.toString(), ', <br/>');
	$("#debugger").html(output.join(''));
};


CanvasCamera.prototype.close = function() {
  $(this.canvas).unbind('mousewheel');
  $(this.canvas).unbind('mouseup');
  $(this.canvas).unbind('mousedown');
  $(this.canvas).unbind('mousemove');
  $(this.canvas).unbind('click');
};

CanvasCamera.prototype.focusOnMouseAfterMouseWheel = function(event) {

	var newScaledCanvasSize = new Point();
	newScaledCanvasSize.set(this.scale * this.canvas.width, this.scale * this.canvas.height);
	//console.log("newScaledCanvasSize", newScaledCanvasSize);

	var newMousePourcentageShouldBe = this.mouseInDrawZone.getDivPoint(newScaledCanvasSize);
	// console.log("newMousePourcentageShouldBe", newMousePourcentageShouldBe.toString());
	// console.log("mousePourcentagePosition", this.mousePourcentagePosition.toString());

	var newCanvasPositionShouldBe = new Point();
	newCanvasPositionShouldBe.copy(newMousePourcentageShouldBe);
	newCanvasPositionShouldBe.x *= this.canvas.width;
	newCanvasPositionShouldBe.y *= this.canvas.height;

	var oldCanvasPositionShouldBe = new Point();
	oldCanvasPositionShouldBe.copy(this.mousePourcentagePosition);
	oldCanvasPositionShouldBe.x *= this.canvas.width;
	oldCanvasPositionShouldBe.y *= this.canvas.height;
	// console.log("newCanvasPositionShouldBe", newCanvasPositionShouldBe.toString());
	// console.log("oldCanvasPositionShouldBe", oldCanvasPositionShouldBe.toString());
	this.focusMouseTranslate.copy(newCanvasPositionShouldBe);
	this.focusMouseTranslate.sub(oldCanvasPositionShouldBe);

	this.translate.copy(this.focusMouseTranslate);
	this.translate.inverse();
	this.updateMousePositions(event);

	// console.log("focusMouseTranslate", this.focusMouseTranslate);
};

CanvasCamera.prototype.mouseWheel = function(e, delta) {
  this.mouseMove(e);
	if (delta > 0) {
		setIntervalX(function(){
			this.scaleUsingFactor(e, -1);
		}.bind(this), 50, this.scaleNum);
	} 
	else {
		setIntervalX(function(){
			this.scaleUsingFactor(e, 1);
		}.bind(this), 50, this.scaleNum);						
	}

};

CanvasCamera.prototype.scaleUsingFactor = function(event, factor) {
  var newScale = ((this.scaleFactor * factor) + 1) * this.scale; 

  if (newScale > this.scaleMax){
    this.scale = this.scaleMax;
    return this.scaleIsMoreThanScaleMax(this);
  } else {
    this.scale = newScale;  
    this.focusOnMouseAfterMouseWheel(event);
    return true;
  }
};


CanvasCamera.prototype.transform = function(ctx) {
	ctx.translate(this.translate.x, this.translate.y);
	ctx.scale(1 / this.scale, 1 / this.scale);
};

CanvasCamera.prototype.updateMousePositions = function(e) {
  this.mousePosition.set(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop);
	this.canvasMousePosition = this.mousePosition.getSubPoint(this.translate);
	this.mousePourcentagePosition.set((this.canvasMousePosition.x + this.translate.x) / this.canvas.width, (this.canvasMousePosition.y + this.translate.y) / this.canvas.height);
};


CanvasCamera.prototype.mouseMove = function(e) {
	if (e == null) return;
	this.updateMousePositions(e);
	var translate = new Point();
  if (this.mouseISDown){
		translate.set(this.canvasMousePosition.x - this.saveMouseDown.x, this.canvasMousePosition.y - this.saveMouseDown.y);
		this.translate.add(translate);
  }  
};

CanvasCamera.prototype.updateScaledSize = function() {
	this.canvasScaledSize.set(this.canvas.width * this.scale, this.canvas.height * this.scale);		
	if (this.scale > 1){
		this.canvasScaledSize.set(this.canvas.width * this.scale, this.canvas.height * this.scale);		
	}
};

CanvasCamera.prototype.update = function() {
  this.tickCount++;
  var debugoutput = [];
  var now = new Date();
  var tickDiff = now.getTime() - this.tickStart;
  //console.log(tickDiff);
  if (tickDiff > 1000){
    $('#fps').html('fps:' + this.tickCount);
    this.tickCount = 0;
    this.tickStart = now.getTime();
  }

	this.updateScaledSize();
  this.scaledCanvasMousePosition = {
  	"x" : (this.canvasMousePosition.x) * this.scale,
  	"y" : (this.canvasMousePosition.y) * this.scale
  };

	this.mouseInDrawZone.copy(this.scaledCanvasMousePosition);
	if (this.mouseInDrawZone.x < 0) this.mouseInDrawZone.x = 0;
	if (this.mouseInDrawZone.y < 0) this.mouseInDrawZone.y = 0;
	if (this.mouseInDrawZone.x > this.drawZoneSize.x) this.mouseInDrawZone.x = this.drawZoneSize.x;
	if (this.mouseInDrawZone.y > this.drawZoneSize.y) this.mouseInDrawZone.y = this.drawZoneSize.y;

	this.mousePourcentageInDrawZone = this.mouseInDrawZone.getDivPoint(this.drawZoneSize);

};

function setIntervalX(callback, delay, repetitions) {
    var x = 0;
    var intervalID = window.setInterval(function () {
       callback();
       if (++x === repetitions) {
       		delay /= 2;
           window.clearInterval(intervalID);
       }
    }, delay);
}