window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback, element) {
      window.setTimeout(callback, 1000/60);
    }
  );
})();



var CanvasCamera = function(canvas){

	this.canvas = canvas;
	this.canvasMousePosition = {"x" : 0, "y" : 0};
	this.scale = 1;
	this.translate = new Point();
	this.canvasScaledSize = new Point();
	this.focusMouseTranslate = new Point();
	this.mousePosition = new Point();

	this.scaleFactor = 0.3;

	this.scaledCanvasMousePosition = {"x" : 0, "y" : 0};
	this.mousePourcentagePosition = {"x" : 0, "y" : 0};

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
	$("#debugger").html(output.join(''));
};


CanvasCamera.prototype.focusOnMouseAfterMouseWheel = function() {


	//this.mousePosition.multiply(this.scale);

	// console.log("mousepos", this.mousePosition);
	// console.log("scale", this.scale);
	/*
	var newScaledCanvasSize = new Point();
	newScaledCanvasSize.set(this.scale * this.canvas.width, this.scale * this.canvas.height);

	console.log("newScaledCanvasSize", newScaledCanvasSize);
	console.log("mouse%pos", this.mousePourcentagePosition);

	this.newMousePosition = {
		"x" : newScaledCanvasSize.x * this.mousePourcentagePosition.x,
		"y" : newScaledCanvasSize.y * this.mousePourcentagePosition.y
	};
	console.log("scaled canvas size", this.canvasScaledSize);
	console.log("new mouse pos", this.newMousePosition);
	
	
	this.focusMouseTranslate.set(
		this.newMousePosition.x - (this.canvasScaledSize.x * this.mousePourcentagePosition.x),
		this.newMousePosition.y - (this.canvasScaledSize.y * this.mousePourcentagePosition.y)
	);
	*/

	//this.focusMouseTranslate.set(1 / this.scale * this.mousePosition.x - this.mousePosition.x, 1 / this.scale * this.mousePosition.x - this.mousePosition.y);
	//console.log("focus", this.focusMouseTranslate);
	//this.translate.add(this.focusMouseTranslate);
	//this.focusMouseTranslate.inverse();
	//this.translate = this.focusMouseTranslate;
	//console.log(this.newMousePosition, this.mousePourcentagePosition, this.focusMouseTranslate);
	// calcul the new size and prepare translation in order to focus on the mouse pointer
	//this.translate.x += focusMouseTranslate.x;
	//this.translate.y += focusMouseTranslate.y;
};

CanvasCamera.prototype.mouseWheel = function(e, delta) {
	var scaleNum = 5;
	if (delta > 0) {
		setIntervalX(function(){
			this.scaleUsingFactor(-1);
		}.bind(this), 50, scaleNum);
	} 
	else {
		setIntervalX(function(){
			this.scaleUsingFactor(1);
		}.bind(this), 50, scaleNum);						
	}
};

CanvasCamera.prototype.scaleUsingFactor = function(factor) {
	this.scale *= (this.scaleFactor * factor) + 1;
	this.focusOnMouseAfterMouseWheel();
};

CanvasCamera.prototype.transform = function(ctx) {
	ctx.translate(this.translate.x, this.translate.y);
	ctx.scale(1 / this.scale, 1 / this.scale);
	//ctx.translate(this.translate.x, this.translate.y);
	//ctx.translate(this.focusMouseTranslate.x, this.focusMouseTranslate.y);
	//this.focusMouseTranslate.reset();

};

CanvasCamera.prototype.updateMousePositions = function(e) {
  this.mousePosition.set(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop);
	this.canvasMousePosition = this.mousePosition.getSub(this.translate);


	this.mousePourcentagePosition = {
		'x' : (this.canvasMousePosition.x + this.translate.x) / this.canvas.width,
	 	'y' : (this.canvasMousePosition.y + this.translate.y) / this.canvas.height
	};  
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