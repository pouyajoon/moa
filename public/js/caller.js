var synchroTime = 1000;
var isDraggingMiniMap = false;


var nodeserver = null;
function intiSockets(){
	nodeserver = io.connect(moa_server);
	nodeserver.on('zone', function (dataZone) {
		console.log('data received', dataZone);
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
		//ctx.scale(1 / camera.worldZoomLevel, 1 / camera.worldZoomLevel);			
		//ctx.translate(-camera.translateX + camera.outSpaceTranslate.x, -camera.translateY + camera.outSpaceTranslate.y);					
		var bigMap = $("#bigMap");
		var ctxBigMap = bigMap[0].getContext('2d');
		ctx.drawImage(camera.bgImage, -camera.worldMaxSize.x / 2, -camera.worldMaxSize.y / 2, camera.worldMaxSize.x * 2, camera.worldMaxSize.y * 2);		
		//ctx.drawImage(camera.bgImage, 0, 0, 500, 500);		
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


var camera = null;
$(function(){
return;

	try	{

		initActionNodes();
		initializeMap();
		intiSockets();
		
		//return;

		switch(drawMode){
			case "zoom" :


				$("#map_canvas").css('display', 'none');
				$("#navigationRight").append("<div id='miniMap'></div>");
				$('#miniMap').css("position", "absolute");	
				$('#miniMap').css("left", "0px");
				$('#miniMap').css("top", "0px");			



				camera = new Camera('#mainScreen');	

				camera.updateMiniMap();

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

				var tileCord = {x : '1062511', y:'721645'};
				var ln = new google.maps.LatLng('48.838000734940096', '2.3921871185302734');
				//var latLngMiddle = myMoaMap.tileCoordinateToMiddleLatLng(tileCord);
				zoomInZonePrepare(tileCord, ln);
				game.currentZone = "1062511_721645";
				nodeserver.emit('getzone', game.currentZone);
			break;
			default :
				

				$("#mainScreen").css('display', 'none');				
				$("#navigationRight").css('display', 'none');

			

		}

$("#navigationRight").draggable();
createTopNavigation();
		


console.log(camera);
		
	//	drawZones();
	//1062498_721635
	//1062511_721645
	//	game.currentZone = "1062511_721645";

			// init the camera
		//console.log('id of mainscreen : ', $('#mainScreen').attr("id"));
		//camera.initialize('#mainScreen');
		//camera.applyChanges();
		//camera.draw(camera);
		
				

		
	//	nodeserver.emit('getzone', game.currentZone);



	//	$('#mainScreen').css('zIndex', 0);
	//	$('#map_canvas').css('zIndex', 5000);	






		

	//	$('#setNodeNone').click(function(){
	//		game.setAction = "none";
	//	});	





		var pageX = 0;
		var pageY = 0;		
	}	catch (e){
		console.log('ERROR : ' + e, e);
	}







});
