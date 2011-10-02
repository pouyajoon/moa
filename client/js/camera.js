 camera = {
	// level of the zoom in main Screen
	'worldZoomLevel':1,
	'zoomFactorLimit' : {'min' : 0.10, 'max' : 1.38},
	'translationFactor' : 20,
//	'worldScreenMinX':0,
//	'worldScreenMinY':0,
//	'worldScreenMaxX':800,
//	'worldScreenMaxY':400,
	// inital canvas size in the user client
	'worldInitX': $('mainScreen').width,
	'worldInitY': $('mainScreen').height,
	// current mainScreen size depending on the zoom & translation
	'ScreenSize': {'w' : $('mainScreen').width, 'h' : $('mainScreen').height},
	// the translation of the left top corner of the mainScreen from the bigMap, represents also the position of the miniMap
	'translateX' : 0,
	'translateY' : 0,
	'bgImage' : new Image(),
	// used only for canvas chages
	'traX' : 0,
	'traY' : 0,
	'trX' : 0,
	'trY' : 0,
	'mousePourcentagePosition' : {},
	// the zoom box initial size
	'zoomSize' : 20,
	'zoomFactor' : 1,
	'outSpaceTranslate' : {'x' : 0, 'y' : 0},
	// the mini map size
	'miniMapSize' : 256,
	'ctx' : null,
	// the size of the bigMap
	'worldMaxSize' : {'x' : 4096, 'y' : 4096},
	'init' : function (mainScreenTag) {

//		console.log('init the camera');
		var mainScreen = $(mainScreenTag);
	
		camera.worldInitX = mainScreen.width();
		camera.worldInitY = mainScreen.height();
		
		camera.zoomFactorLimit.max = camera.worldMaxSize.x / 256;
		camera.worldZoomLevel = camera.zoomFactorLimit.max;
		
//		console.log(this);
//		$("#bigMap").worldInitX = mainScreen.width();
//		$("#bigMap").worldInitY = mainScreen.height();				
				
		mainScreen.mousedown( function (event) {
			// left click
			$(this).css('cursor', 'move');
			console.log("mouse down");
			if (event.which == 1){
				camera.pageX = event.pageX;
				camera.pageY = event.pageY;
			}
			camera.mouseDown = true;		
		});
		
		// mouse event for translation
		mainScreen.mousemove(function(event) {

			if (camera.mouseDown) {				
				var moveOnX = camera.pageX - event.pageX;
				var moveOnY = camera.pageY - event.pageY;		
				var traX = 0;
				var traY = 0;
				var traMove = camera.translationFactor * camera.worldZoomLevel;
//				console.log("down : " + moveOnX + ", " + moveOnY + '|| pageX : ' + camera.pageX + ', ' + camera.pageY + '||' + event.pageX + ', ' + event.pageY);
				if (moveOnX != 0) (moveOnX > 0) ? traX = traMove : traX = -traMove;
				if (moveOnY != 0)	(moveOnY > 0) ? traY = traMove : traY = -traMove;	
				camera.traX = traX;
				camera.traY = traY;		
				camera.applyChanges();	
				camera.pageX = event.pageX;				
				camera.pageY = event.pageY;				
//				camera.draw(camera);				
			}
		});		
//	
		mainScreen.mouseup( function (event) {
			camera.mouseDown = false;
			$(this).css('cursor', 'default');
		});	
		

		mainScreen.mousewheel(function(event, delta) {
			console.log('mouse wheel : ' + drawMap + "+" + delta);
//			if (drawMap == true) return;
//			$(this).css('cursor', 'progress');
			
			var mouseRelativePositionOnScreen = {'x' : event.pageX, 'y' : event.pageY};
			camera.mousePourcentagePosition = {'x' : mouseRelativePositionOnScreen.x / camera.worldInitX,
			 'y' : mouseRelativePositionOnScreen.y / camera.worldInitY};
			//console.log(camera.mousePourcentagePosition);
					
			if (delta > 0) {
				camera.zoomFactor = 0.8;
			} 
			else {
				camera.zoomFactor = 1.2
			};
			if (camera.worldZoomLevel * camera.zoomFactor < camera.zoomFactorLimit.min){
				camera.zoomFactor = 1;
				camera.worldZoomLevel = camera.zoomFactorLimit.min;
			}			
			if (camera.worldZoomLevel * camera.zoomFactor > camera.zoomFactorLimit.max){
				camera.zoomFactor = 1;
				camera.worldZoomLevel = camera.zoomFactorLimit.max;
				// go out from the current Zone
				zoomOutFromZone();
			}
//			var localWorldZoom = camera.worldZoomLevel * camera.zoomFactor;
			
			camera.applyChanges();			
			return false;
		});		
	},
	'draw' : function (me){
//		console.log(me);
		if (me != null){
			var worldZoom = (me.worldZoomLevel + "").substring(0, 8);
			var traX = (me.translateX + "").substring(0, 8);			
			var traY = (me.translateY + "").substring(0, 8);
			var tX = (me.outSpaceTranslate.x + "").substring(0, 8);			
			var tY = (me.outSpaceTranslate.y + "").substring(0, 8);
			var sW = (me.ScreenSize.w + "").substring(0, 8);
			var sH = (me.ScreenSize.h + "").substring(0, 8);
						
			$('#worldZoomLevelValue').html(worldZoom);		
//			$('#worldZoomLevelValue').html(this);	
			$('#translateXValue').text(traX);
			$('#translateYValue').text(traY);	
			$('#tXValue').text(tX);
			$('#tYValue').text(tY);				
			$('#ScreenSizeXValue').text(sW);
			$('#ScreenSizeYValue').text(sH);			
//			$('#ProcessingTimeValue').text(me.processingTime + ' ms');
			//console.log(camera);	
		
		}
	},
	'applyChanges' : function (){
		console.log('apply camera');

//	console.log(camera);
		// check if the canvas real size didn't change
		camera.worldInitX = $('#mainScreen').width();
		camera.worldInitY = $('#mainScreen').height();		
				
		// update worldZoom
		camera.worldZoomLevel *= camera.zoomFactor;			
			

		// update worldSize
		camera.ScreenSize.w = camera.worldInitX * camera.worldZoomLevel;			
		camera.ScreenSize.h = camera.worldInitY * camera.worldZoomLevel;	
	
	
		// update translations
		camera.translateX += camera.traX;
		camera.translateY += camera.traY;		
		
		// set the out zone translation
		if (camera.worldZoomLevel >= camera.worldMaxSize.x / camera.worldInitX ||
		 camera.worldZoomLevel >= camera.worldMaxSize.y / camera.worldInitY){
			var uselessSpace = {
				'x' : camera.ScreenSize.w - camera.worldMaxSize.x,
				'y' : camera.ScreenSize.h - camera.worldMaxSize.y
			};
			camera.outSpaceTranslate = {
				'x' : uselessSpace.x / 2,
				'y' : uselessSpace.y / 2
			}
			if (camera.outSpaceTranslate.x < 0) camera.outSpaceTranslate.x = 0;
			if (camera.outSpaceTranslate.y < 0) camera.outSpaceTranslate.y = 0;			
		}
		else{
			camera.outSpaceTranslate = {
				'x' : 0,
				'y' : 0
			}	
		}



		// limit the translate to don't go more than the max size
		if (camera.translateX + camera.ScreenSize.w > camera.worldMaxSize.x){
			camera.translateX -= camera.translateX + camera.ScreenSize.w - camera.worldMaxSize.x;
		}
		if (camera.translateY + camera.ScreenSize.h > camera.worldMaxSize.y){
			camera.translateY -= camera.translateY + camera.ScreenSize.h - camera.worldMaxSize.y;
		}				
		if (camera.translateX < 0) camera.translateX = 0;
		if (camera.translateY < 0) camera.translateY = 0;		
				
		// update miniMap
		camera.updateMiniMap();
		camera.draw(camera);
		
		// reset variables
		camera.zoomFactor = 1;
		camera.traX = 0;
		camera.traY = 0;		
		return;
	
	},
	updateMiniMap : function(){
		// update size
		var miniMapDOM = $('#miniMap');
		var miniMapWidth = camera.miniMapSize;
		var miniMapHeight = camera.miniMapSize;
		if (camera.ScreenSize.w <= camera.worldMaxSize.x) {
			miniMapWidth = (camera.ScreenSize.w  / camera.worldMaxSize.x) * camera.miniMapSize;
		}
		if (camera.ScreenSize.h <= camera.worldMaxSize.y) {
			miniMapHeight = (camera.ScreenSize.h  / camera.worldMaxSize.y) * camera.miniMapSize;			
		}
		miniMapDOM.width(miniMapWidth);
		miniMapDOM.height(miniMapHeight);
		
		// update position
		var miniMapLeft = (camera.translateX / camera.worldMaxSize.x) * camera.miniMapSize;
		var miniMapTop = (camera.translateY / camera.worldMaxSize.y) * camera.miniMapSize;
		miniMapDOM.css('left', miniMapLeft + 1);
		miniMapDOM.css('top', miniMapTop  + 1);				 	 
	}
};




