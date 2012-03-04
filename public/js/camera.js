 
// var Camera = function (mainScreenTag) {

// 	// level of the zoom in main Screen
// 	this.worldZoomLevel = 1;
// 	this.zoomFactorLimit = {'min' : 0.10, 'max' : 1.38};
// 	this.translationFactor = 20;

// 	var mainScreen = $(mainScreenTag);
	

// 	this.worldMaxSize = {w : 4096, h : 4096};
// 	this.worldInitX = mainScreen.width();
// 	this.worldInitY = mainScreen.height();
// 	this.ScreenSize = {w : 0, h : 0};
// 	this.traX = 0;
// 	this.traY = 0;
// 	this.trX = 0;
// 	this.trY = 0;
// 	this.mousePourcentagePosition = {};
// 	this.translateX = 0;
// 	this.translateY = 0;

// 	this.outSpaceTranslate = {x : 0, y : 0};

// 	this.zoomFactorLimit.max = this.worldMaxSize.w / 256;
// 	this.worldZoomLevel = this.zoomFactorLimit.max;

// 	this.initializeMouseEvents(mainScreen, this);
// 	console.log('init the camera', mainScreen.attr('id'));
// }


// Camera.prototype.initializeMouseEvents = function (mainScreen, camera){
// 	mainScreen.mousedown( function (event) {
// 			// left click
// 			$(this).css('cursor', 'move');
// 			console.log("mouse down");
// 			if (event.which == 1){
// 				camera.pageX = event.pageX;
// 				camera.pageY = event.pageY;
// 			}
// 			camera.mouseDown = true;		
// 		});

// 		// mouse event for translation
// 		mainScreen.mousemove(function(event) {

// 			if (camera.mouseDown) {				
// 				var moveOnX = camera.pageX - event.pageX;
// 				var moveOnY = camera.pageY - event.pageY;		
// 				var traX = 0;
// 				var traY = 0;
// 				var traMove = camera.translationFactor * camera.worldZoomLevel;
// //				console.log("down : " + moveOnX + ", " + moveOnY + '|| pageX : ' + camera.pageX + ', ' + camera.pageY + '||' + event.pageX + ', ' + event.pageY);
// 				if (moveOnX != 0) (moveOnX > 0) ? traX = traMove : traX = -traMove;
// 				if (moveOnY != 0)	(moveOnY > 0) ? traY = traMove : traY = -traMove;	
// 				camera.traX = traX;
// 				camera.traY = traY;		
// 				camera.applyChanges();	
// 				camera.pageX = event.pageX;				
// 				camera.pageY = event.pageY;				
// //				camera.draw(camera);				
// 			}
// 		});		
// //	
// 		mainScreen.mouseup( function (event) {
// 			camera.mouseDown = false;
// 			$(this).css('cursor', 'default');
// 		});	


// 		mainScreen.mousewheel(function(event, delta) {
// 			console.log('mouse wheel : ' + drawMap + "+" + delta);
// //			if (drawMap == true) return;
// //			$(this).css('cursor', 'progress');

// 			var mouseRelativePositionOnScreen = {'x' : event.pageX, 'y' : event.pageY};
// 			camera.mousePourcentagePosition = {'x' : mouseRelativePositionOnScreen.x / camera.worldInitX,
// 			 'y' : mouseRelativePositionOnScreen.y / camera.worldInitY};
// 			//console.log(camera.mousePourcentagePosition);

// 			if (delta > 0) {
// 				camera.zoomFactor = 0.8;
// 			} 
// 			else {
// 				camera.zoomFactor = 1.2
// 			};
// 			if (camera.worldZoomLevel * camera.zoomFactor < camera.zoomFactorLimit.min){
// 				camera.zoomFactor = 1;
// 				camera.worldZoomLevel = camera.zoomFactorLimit.min;
// 			}			
// 			if (camera.worldZoomLevel * camera.zoomFactor > camera.zoomFactorLimit.max){
// 				camera.zoomFactor = 1;
// 				camera.worldZoomLevel = camera.zoomFactorLimit.max;
// 				// go out from the current Zone
// 				//zoomOutFromZone();
// 			}
// //			var localWorldZoom = camera.worldZoomLevel * camera.zoomFactor;

// 			camera.applyChanges();			
// 			return false;
// 		});		
// }



// Camera.prototype.draw = function(me) {
// //		console.log(me);
// 	if (me != null){
// 		var worldZoom = (me.worldZoomLevel + "").substring(0, 8);
// 		var traX = (me.translateX + "").substring(0, 8);			
// 		var traY = (me.translateY + "").substring(0, 8);
// 		var tX = (me.outSpaceTranslate.x + "").substring(0, 8);			
// 		var tY = (me.outSpaceTranslate.y + "").substring(0, 8);
// 		var sW = (me.ScreenSize.w + "").substring(0, 8);
// 		var sH = (me.ScreenSize.h + "").substring(0, 8);
					
// 		$('#worldZoomLevelValue').html(worldZoom);		
// 	//			$('#worldZoomLevelValue').html(this);	
// 		$('#translateXValue').text(traX);
// 		$('#translateYValue').text(traY);	
// 		$('#tXValue').text(tX);
// 		$('#tYValue').text(tY);				
// 		$('#ScreenSizeXValue').text(sW);
// 		$('#ScreenSizeYValue').text(sH);			
// 	//			$('#ProcessingTimeValue').text(me.processingTime + ' ms');
// 		//console.log(this);	

// 	}
// }



// Camera.prototype.applyChanges = function (){
// 		console.log('apply this');

// //	console.log(this);
// 		// check if the canvas real size didn't change
// 		this.worldInitX = $('#mainScreen').width();
// 		this.worldInitY = $('#mainScreen').height();		
				
// 		// update worldZoom
// 		this.worldZoomLevel *= this.zoomFactor;			
			

// 		// update worldSize
// 		this.ScreenSize.w = this.worldInitX * this.worldZoomLevel;			
// 		this.ScreenSize.h = this.worldInitY * this.worldZoomLevel;	
	
	
// 		// update translations
// 		this.translateX += this.traX;
// 		this.translateY += this.traY;		
		
// 		// set the out zone translation
// 		if (this.worldZoomLevel >= this.worldMaxSize.x / this.worldInitX ||
// 		 this.worldZoomLevel >= this.worldMaxSize.y / this.worldInitY){
// 			var uselessSpace = {
// 				'x' : this.ScreenSize.w - this.worldMaxSize.x,
// 				'y' : this.ScreenSize.h - this.worldMaxSize.y
// 			};
// 			this.outSpaceTranslate = {
// 				'x' : uselessSpace.x / 2,
// 				'y' : uselessSpace.y / 2
// 			}
// 			if (this.outSpaceTranslate.x < 0) this.outSpaceTranslate.x = 0;
// 			if (this.outSpaceTranslate.y < 0) this.outSpaceTranslate.y = 0;			
// 		}
// 		else{
// 			this.outSpaceTranslate = {
// 				'x' : 0,
// 				'y' : 0
// 			}	
// 		}


// 		// limit the translate to don't go more than the max size
// 		if (this.translateX + this.ScreenSize.w > this.worldMaxSize.x){
// 			this.translateX -= this.translateX + this.ScreenSize.w - this.worldMaxSize.x;
// 		}
// 		if (this.translateY + this.ScreenSize.h > this.worldMaxSize.y){
// 			this.translateY -= this.translateY + this.ScreenSize.h - this.worldMaxSize.y;
// 		}				
// 		if (this.translateX < 0) this.translateX = 0;
// 		if (this.translateY < 0) this.translateY = 0;		
				
// 		// update miniMap
// 		this.updateMiniMap();
// 		this.draw(this);
		
// 		// reset variables
// 		this.zoomFactor = 1;
// 		this.traX = 0;
// 		this.traY = 0;		
// 		return;
	
// 	}


// Camera.prototype.updateMiniMap = function(){
// 		// update size
// 		var miniMapDOM = $('#miniMap');
// 		var miniMapWidth = this.miniMapSize;
// 		var miniMapHeight = this.miniMapSize;
// 		if (this.ScreenSize.w <= this.worldMaxSize.x) {
// 			miniMapWidth = (this.ScreenSize.w  / this.worldMaxSize.x) * this.miniMapSize;
// 		}
// 		if (this.ScreenSize.h <= this.worldMaxSize.y) {
// 			miniMapHeight = (this.ScreenSize.h  / this.worldMaxSize.y) * this.miniMapSize;			
// 		}
// 		miniMapDOM.width(miniMapWidth);
// 		miniMapDOM.height(miniMapHeight);
		
// 		// update position
// 		var miniMapLeft = (this.translateX / this.worldMaxSize.x) * this.miniMapSize;
// 		var miniMapTop = (this.translateY / this.worldMaxSize.y) * this.miniMapSize;
// 		miniMapDOM.css('left', miniMapLeft + 1);
// 		miniMapDOM.css('top', miniMapTop  + 1);				 	 
// 	} 
 

// //  var camera = {

// // 	'worldZoomLevel':1,
// // 	'zoomFactorLimit' : {'min' : 0.10, 'max' : 1.38},
// // 	'translationFactor' : 20,
// // //	'worldScreenMinX':0,
// // //	'worldScreenMinY':0,
// // //	'worldScreenMaxX':800,
// // //	'worldScreenMaxY':400,
// // 	// inital canvas size in the user client
// // 	'worldInitX': 0,
// // 	'worldInitY': 0,
// // 	// current mainScreen size depending on the zoom & translation
// // 	'ScreenSize': {'w' : 0, 'h' : 0},
// // 	// the translation of the left top corner of the mainScreen from the bigMap, represents also the position of the miniMap
// // 	'translateX' : 0,
// // 	'translateY' : 0,
// // 	'bgImage' : new Image(),
// // 	// used only for canvas chages
// // 	'traX' : 0,
// // 	'traY' : 0,
// // 	'trX' : 0,
// // 	'trY' : 0,
// // 	'mousePourcentagePosition' : {},
// // 	// the zoom box initial size
// // 	'zoomSize' : 20,
// // 	'zoomFactor' : 1,
// // 	'outSpaceTranslate' : {'x' : 0, 'y' : 0},
// // 	// the mini map size
// // 	'miniMapSize' : 256,
// // 	'ctx' : null,
// // 	// the size of the bigMap
// // 	'worldMaxSize' : {'x' : 4096, 'y' : 4096},
// // 	'initialize' : function (mainScreenTag) {



// // //		console.log(this);
// // //		$("#bigMap").worldInitX = mainScreen.width();
// // //		$("#bigMap").worldInitY = mainScreen.height();				
				
	
// // 	},
	

// // };