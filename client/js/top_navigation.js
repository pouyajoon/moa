var drawMap = true;


// prepare the zone before zooming In
function zoomInZonePrepare(tileCoordinate, latLngMiddle){
	
	var tileID = tileCoordinate.x + '_' + tileCoordinate.y;
	// get the zone Img
	var imgUrl = myMoaMap.getMapImageURL(latLngMiddle);
	
	// load the background Image of the Zone
	var mainImgUrl = imgUrl + '&size=512x512&scale=2';
	camera.bgImage = new Image();
	camera.bgImage.src = mainImgUrl;
	// load the bigMap image
	var bigMapURL = imgUrl + '&size=256x256';
	// set the bg image of bigMap
	$('#bigMap').css('background-image', 'url("' + bigMapURL + '")');
	$('#bigMap').css('background-size', '256px');		
	camera.init('#mainScreen');
		
	// set the tile coordinate
	game.currentZone = tileID;
	
	// start reading the sockets
	nodeserver.emit("getzone", tileID);		

}

// zoom in to a zone
function zoomInZone(){
//		drawMap = false;
					
		$('#map_canvas').fadeOut(250);
		$('#mainScreen').fadeIn(250);	
		$('#navigationRight').fadeIn(500);
}


// zoom out from a zone
function zoomOutFromZone(){
//			drawMap = true;

			
			nodeserver.emit('stopzone');
			$('#mainScreen').fadeOut();
			$('#navigationRight').fadeOut();		
//			$('#mainScreen').css('zIndex', 0);
//			$('#map_canvas').css('zIndex', 5000);
//			$('#bigMap').css('zIndex', 0);										
			$('#map_canvas').fadeIn(500);
			
			if (map != null){
				google.maps.event.trigger(map, 'resize');
				map.setZoom( map.getZoom() );			
			}
			
//			game.currentZone = null;

}


// prepare the navigation button
function createTopNavigation(){

	$('#buttonSubscibe').click(function(){
			if (game.currentZone != null) {			
				nodeserver.emit('createQueen', game.currentZone);
			}
	});

}
