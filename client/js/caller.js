var woa_server = "http://pouya:8080/";
// var woa_server = "http://woa.happyfunkyfoundation.com:8080/";

//var woa_server = "http://masterofants.com:8080/";


var synchroTime = 1000;
var isDraggingMiniMap = false;


var nodeserver = null;
function intiSockets(){
	nodeserver = io.connect(woa_server);
	nodeserver.on('zone', function (dataZone) {
//		console.log('data received');
//		console.log(dataZone);
		var ants = dataZone.ants;
		var actionNodes = dataZone.actionNodes;

		var mainScreen = $('#mainScreen');					
		var startTime = Date.now();
		
		if (isNaN(camera.translateX)) camera.translateX = 0;
		if (isNaN(camera.translateY)) camera.translateY = 0;				
		
		var b_canvas = document.getElementById("mainScreen");		
		b_canvas.width = camera.worldInitX;
		b_canvas.height = camera.worldInitY;
				
		var ctx = mainScreen[0].getContext('2d');
		ctx.canvas.width  = mainScreen.width();
		ctx.canvas.height = mainScreen.height();
//		ctx.clearRect(0, 0, camera.worldMaxSize.x, camera.worldMaxSize.y);									
		ctx.scale(1 / camera.worldZoomLevel, 1 / camera.worldZoomLevel);			
		ctx.translate(-camera.translateX + camera.outSpaceTranslate.x, -camera.translateY + camera.outSpaceTranslate.y);					
		var bigMap = $("#bigMap");
		var ctxBigMap = bigMap[0].getContext('2d');
		ctx.drawImage(camera.bgImage, -camera.worldMaxSize.x / 2, -camera.worldMaxSize.y / 2, camera.worldMaxSize.x * 2, camera.worldMaxSize.y * 2);		
		// draw the red border of the zone
		ctx.lineWidth = 4;
		ctx.strokeStyle = '#f00'; // red
	  	ctx.strokeRect(1, 1, camera.worldMaxSize.x - 1, camera.worldMaxSize.y - 1)

		// draw the server elements
	  //drawStaticElements(ctx, data);
		drawAnts(ctx, ants);
		drawActionNodes(ctx, actionNodes);

		// draw the big map
		drawBigMap(ctxBigMap, ants);		
		
	});

		
	nodeserver.on('connect', function (data) {

		
	});


}

$(function(){


	
	initActionNodes();
	initializeMap();
	intiSockets();
//	drawZones();
//1062498_721635
//1062511_721645
//	game.currentZone = "1062511_721645";

	
		// init the camera
	camera.init('#mainScreen');
	camera.applyChanges();
//	camera.draw(camera);
	createTopNavigation();
//	nodeserver.emit('getzone', game.currentZone);



//	$('#mainScreen').css('zIndex', 0);
//	$('#map_canvas').css('zIndex', 5000);	

	$("#mainScreen").css('display', 'none');				
	$("#navigationRight").css('display', 'none');
	$("#navigationRight").draggable();

	$("#navigationRight").append("<div id='miniMap'></div>");
	$('#miniMap').css("position", "absolute");	
	$('#miniMap').css("left", "0px");
	$('#miniMap').css("top", "0px");
	camera.updateMiniMap();
	

//	$('#setNodeNone').click(function(){
//		game.setAction = "none";
//	});	

	$("#miniMap").draggable({ 
		containment: "#bigMap",
		drag : function() {
		

			var traX = (($(this).position().left - 1) / camera.miniMapSize) * camera.worldMaxSize.x;
			var traY = (($(this).position().top - 1) / camera.miniMapSize) * camera.worldMaxSize.y;
//			console.log('left : %s, top : %s', $(this).position().left, $(this).position().top );
			camera.translateX = traX;
			camera.translateY = traY;
			camera.applyChanges();
		}
	});

	var mainScreen = $('#mainScreen');
	
	mainScreen.click(function(event){
//		alert(game.setAction);
		if (game.setAction != 'none'){
			nodeserver.emit('ssetaction', {'zoneid' : game.currentZone,'camera' : camera, 'action' : game.setAction, 'x' : event.pageX, 'y' : event.pageY});
		}
	});

	var pageX = 0;
	var pageY = 0;




});
