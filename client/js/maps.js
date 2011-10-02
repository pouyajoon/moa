



function tileCoordinateToLatLng(tileCoordinate)
{
	var numTiles = 1 << map.getZoom();
  var px0 = new google.maps.Point(
      tileCoordinate.x * TILE_SIZE,
      tileCoordinate.y * TILE_SIZE);
  var pt0 = new google.maps.Point(
      px0.x / numTiles,
      px0.y / numTiles);
	var latlng0 = map.getProjection().fromPointToLatLng(pt0);
	return latlng0;
} 

//function CoordMapType(tileSize) {
//  this.tileSize = tileSize;
//}

//CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
////	console.log(zoom);
// 	//if (zoom >= 21)
// 	{
//		var div = ownerDocument.createElement('DIV');
//		div.innerHTML = coord;
//		div.style.width = this.tileSize.width + 'px';
//		div.style.height = this.tileSize.height + 'px';
//		div.style.fontSize = '10';
//		div.style.borderStyle = 'solid';
//		div.style.borderWidth = '1px';
//		div.style.borderColor = '#AAAAAA';
//		return div; 	
// 	}
//};

// init the zones
var allZones = Array();
var zoneSize = 0.00020;
var worldSizeLat = 25;
var worldSizeLng = 50;	
var worldSW = new google.maps.LatLng(48.835, 2.390);
var worldNE = new google.maps.LatLng(worldSW.lat() + zoneSize * worldSizeLat, worldSW.lng() + zoneSize * worldSizeLng);	


//var rectOptions = {
//	strokeColor: "#666",
//	strokeOpacity: 0.8,
//	strokeWeight: 0.5,
////	fillColor: "#FF0000",
//	fillOpacity: 0,
//};



		
var mapCanvasStub = {};
var map = {};
var chicago = new google.maps.LatLng(41.850033,-87.6500523);
var ruetaine = new google.maps.LatLng(48.837890444364774, 2.392113855719572);

//http://maps.googleapis.com/maps/api/staticmap?center=48.837890444364774,2.392113855719572&zoom=21&size=256x256&sensor=false
//var coordinateMapType = new CoordMapType();


var zones = Array();


var allTiles = {};

function CoordMapType(tileSize) {
  this.tileSize = tileSize;
}

CoordMapType.prototype.maxZoom = 60;


CoordMapType.prototype.releaseTile = function(tile) {



}





CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
	//if (zoom < 10) return;

//	console.log(google.maps.ImageMapTypeOptions.getTileUrl(coord));
	var	latlng = tileCoordinateToMiddleLatLng(coord);
	var id = coord.x + '_' + coord.y;
//	allTiles[id] = latlng;

  var div = ownerDocument.createElement('DIV');
  div.innerHTML = '';//coord.toString();
  div.style.width = this.tileSize.width + 'px';
  div.style.height = this.tileSize.height + 'px';
	div.id = id;
	//zoom > 15 && zoom <= 18 || 
	if (zoom == 21){
//  div.style.fontSize = '10';
  div.style.borderStyle = 'dotted';
  div.style.borderWidth = '1px';
//	div.style.opacity = 0.2;
  div.style.borderColor = '#CCC';	
	}
  
  if (zoom < 21 && zoom > 20){
		var size = (21 - zoom) * 2 ;
		for (var i = 0; i < size * size; ++i){
			
			var left = this.tileSize.width / size * (i % size);
			var top = this.tileSize.height / size * Math.floor(i / size);  	
	//  	if (i % 2 == 0) left = 0;
		
			div.innerHTML += '<div style="border:1px dotted #CCC;width:' + this.tileSize.width / size+ ';height:' + this.tileSize.height / size + ';position:absolute;left:' + left + 'px;top:' + top+ 'px"></div>';
		}  
  }

 return div;
};


var TILE_SIZE = 256;


var CoordMap = new CoordMapType(new google.maps.Size(256, 256));

function zoomIn(ENDZOOM, center) {
//				console.log(center);
        if( map.getZoom() < ENDZOOM ) {
                map.setZoom(map.getZoom() + 2);
                map.panTo(center);                
                setTimeout("zoomIn(21, new google.maps.LatLng(" + center.lat() + ", " + center.lng() + "))", 200);

        }
}

	var mapStyle = [ { featureType: "poi", stylers: [ { visibility: "off" } ] },{ featureType: "road", stylers: [ { visibility: "on" }, { hue: "#4cff00" } ] },{ featureType: "water", stylers: [ { lightness: -25 }, { hue: "#003bff" } ] },{ featureType: "poi.school", stylers: [ { visibility: "on" } ] },{ featureType: "poi.park", stylers: [ { visibility: "on" } ] },{ featureType: "road.highway", elementType: "labels", stylers: [ { visibility: "off" } ] } , { featureType: "poi.park", stylers: [ { visibility: "on" }, { hue: "#2bff00" }, { gamma: 0.31 } ] }];

//var mapStyle =[{ featureType: "poi.park", stylers: [ { visibility: "on" }, { hue: "#2bff00" }, { gamma: 0.31 } ] }];



function getMapOptionsURL(){
	var t = "";
	for (var ftk in map.styles){
		var ft = map.styles[ftk];
		t += '&style=feature:' + ft.featureType;
		if (ft.elementType != null){
			t += '|elementType:' + ft.elementType;
		}
		for(var i in ft.stylers){
			for(var styleName in ft.stylers[i]){
				var s = ft.stylers[i][styleName];
//				console.log('i:' + j + ', s :' + s);	
//				console.log(s);
				if (typeof(s)=='string'){
					s = s.replace("#", '0x');							
				}
				
				t += '|' + styleName + ':' + s;
			}
		}
//		console.log(ft + ', ' + );
	}
	//console.log(t);
	return t;//escape(t);
}

function getMapImage(latlng){
	var imgUrl = 'http://maps.googleapis.com/maps/api/staticmap?center=' + latlng.lat()+ ','+ latlng.lng()+ '&zoom=21&sensor=false';
	imgUrl += getMapOptionsURL();
	 // + '&style=' + getMapOptionsURL();;
//	console.log();
//	console.log(imgUrl);
	return imgUrl;//encodeURI(imgUrl);
}

function tileCoordinateToMiddleLatLng(tileCoordinate){
	var	latlng0 = tileCoordinateToLatLng(tileCoordinate);
	var	latlng1 = tileCoordinateToLatLng({'x' : tileCoordinate.x + 1, 'y' : tileCoordinate.y + 1});	
	var latlngmiddle = new google.maps.LatLng(
		latlng0.lat() + (latlng1.lat() - latlng0.lat()) / 2, 
		latlng0.lng() + (latlng1.lng() - latlng0.lng()) / 2);
	return latlngmiddle;
}


function initializeMap() {


  var mapOptions = {
    zoom: 15,
    maxZoom : 60,
    center: worldSW,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: mapStyle
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);


	map.overlayMapTypes.insertAt(0, CoordMap);

	mapCanvasStub = function (map) { this.setMap(map); }  // start building overlay stub
	mapCanvasStub.prototype = new google.maps.OverlayView(); 
	mapCanvasStub.prototype.draw = function() {}; 
	mapCanvasStub = new mapCanvasStub(map);





google.maps.event.addListener(marker, 'click', function () {

	var bounds = new google.maps.LatLngBounds();
	bounds.extend(this.getPosition());
	zoomIn(21, this.getPosition());
	map.panToBounds(bounds);      
//	map.setZoom(20);
	
	var localMarker = this;
//	toogleMaps();
//	this.setAnimation(google.maps.Animation.BOUNCE);
//	setTimeout(function(){		
//		localMarker.setAnimation(null);
//	}, 1000)
	
});






google.maps.event.addListener(map, 'click', function(event){
	
	map.panTo(event.latLng);


	var zoom = map.getZoom();
	if (zoom != 21) return;

	var numTiles = 1 << map.getZoom();

  
  var worldCoordinate = event.point;//projection.fromLatLngToPoint(event.latLng);
  var pixelCoordinate = new google.maps.Point(
      worldCoordinate.x * numTiles,
      worldCoordinate.y * numTiles);
     
  var tileCoordinate = new google.maps.Point(
      Math.floor(pixelCoordinate.x / TILE_SIZE),
      Math.floor(pixelCoordinate.y / TILE_SIZE));

	var	latlng0 = tileCoordinateToLatLng(tileCoordinate);
	
  var px0 = new google.maps.Point(
      tileCoordinate.x * TILE_SIZE,
      tileCoordinate.y * TILE_SIZE);	
  		console.log(px0);
	
	var	latlng1 = tileCoordinateToLatLng({'x' : tileCoordinate.x + 1, 'y' : tileCoordinate.y + 1});
//		console.log(latlng0);
//			console.log(latlng1);

	var latlngmiddle = new google.maps.LatLng(
		latlng0.lat() + (latlng1.lat() - latlng0.lat()) / 2, 
		latlng0.lng() + (latlng1.lng() - latlng0.lng()) / 2);

	var projection = mapCanvasStub.getProjection();
	var divX = projection.fromLatLngToDivPixel(latlng0);

		
		var imgUrl = getMapImage(latlngmiddle);

		
		camera.bgImage = new Image();
		var mainImgUrl = imgUrl + '&size=512x512&scale=2';

		camera.bgImage.src = mainImgUrl;
		
		var bigMapURL = imgUrl + '&size=256x256';
		//$('#mainScreen').css('background-image', 'url("' + imgUrl +'")');
		//$('#mainScreen').css('background-size', camera.worldMaxSize.x);
		$('#bigMap').css('background-image', 'url("' + bigMapURL + '")');
		$('#bigMap').css('background-size', '256px');		
		// set the tile coordinate
		game.currentZone = tileCoordinate.x + '_' + tileCoordinate.y;
		camera.init();
//		console.log(camera);
//		camera.worldZoomLevel = camera.worldMaxSize.x / camera.worldInitX;
//		console.log('zoom : ' + camera.worldZoomLevel);

		drawMap = false;
		map.panTo(latlngmiddle);
		nodeserver.emit("getzone", tileCoordinate.x + '_' + tileCoordinate.y);	

//		camera.worldZoomLevel = camera.zoomFactorLimit.max;
		var panToActive = true;

		google.maps.event.addListener(map, 'idle', function(event){
			if (!panToActive) return;
			setTimeout(function(){
//				$('#mainScreen').css('zIndex', 5000);
//				$('#map_canvas').css('zIndex', 0);										
				$('#map_canvas').fadeOut(250);
				$('#mainScreen').fadeIn(250);	
				$('#navigationRight').fadeIn(500);					
				panToActive = false;
			}, 250);		
		});
		

	


//		$('#tiles').append('<div id="playZone" style="z-index:200px;border:1px solid #000;width:256px;height:256px;position:absolute;left:' + divX.x + 'px;top:' + divX.y+ 'px"></div>');
//		var size = camera.worldZoomLevel * 2560 +"px";
//		console.log('size: ' + size);
//		$('#playZone').animate({left:'0px', top:'0px', width:size, height:size}, 1000, function (){
//				$('#tiles').html('');
//				$('#mainScreen').fadeIn();
//			
//		});
		
//		setInterval(function() {
//			// Do something every synchroTime 
//			camera.applyChanges();
//			camera.draw(camera);
//		}, synchroTime);			


//	var box = $('#' + id);	
//	box.css('background-color', 'cyan');
//	box.css('position', 'absolute');
//	box.css('width', this.tileSize.width);
//	box.css('height', this.tileSize.height);		
//	box.css('z-index', '200');
//	$('#tiles').append('<div id="' + id + '"></div>');	

//new google.maps.Marker({
//  map: map,
//  position: latlngmiddle
//});		
//		
//	console.log(latlngmiddle);
			
//new google.maps.Marker({
//  map: map,
//  position: latlng0
//});

//new google.maps.Marker({
//  map: map,
//  position: latlng1
//});





  //conso//le.log('latlng');
	//console.log(latlng);
	
//var n = 2 ^ zoom;
//var arg = Math.PI * (1 - 2 * tileCoordinate.y / n);
//var sinh = (Math.exp(arg) - Math.exp(-arg)) / 2;
//var lon_deg = tileCoordinate.x / n * 360.0 - 180.0;
//var lat_rad = Math.atan(sinh);
//var lat_deg = lat_rad * 180.0 / Math.PI	;

//	console.log({"x" : lon_deg, 'y' : lat_deg});	
//	var tile = google.maps.Point(Math.floor(event.point.x / 256),  Math.floor(event.point.y / 256));
////	tile.x = ;
////	tile.y =;
//	var boundspixels = tile.x*256 + " " + tile.y*256 + " " + (tile.x+1)*256 + " " + (tile.y+1)*256;
//	console.log(boundspixels);



//	var tile = tileCoordinate;
////	var currentProjection = CoordMapType.getProjection();
//	var currentProjection = G_NORMAL_MAP.getProjection();
////	var currentProjection = map.get_projection();
//	var p1 = new google.maps.Point(tile.x*256,(tile.y+1)*256);
//	var p2 = new google.maps.Point((tile.x+1)*256,tile.y*256);
//	

////	var latlng2 = projection.fromContainerPixelToLatLng(p2);	


// 	var latlng1 = currentProjection.fromPixelToLatLng(p1);
//  var latlng2 = currentProjection.fromPixelToLatLng(p2);
//  var boundswgs84 = latlng1.lng()+" "+latlng1.lat()+"<br/>"+latlng2.lng()+" "+latlng2.lat();	
//  console.log(boundswgs84);	
//	
	

//	nodeserver.emit("getzone", tileCoordinate.x + '_' + tileCoordinate.y);
//	var olmap = new OpenLayers.Map('map');	
//	var proj = new OpenLayers.Projection("EPSG:3857");
//	var point = new OpenLayers.LonLat(tileCoordinate.x, tileCoordinate);
//	var p2 = point.transform(proj, olmap.getProjectionObject());
//	console.log(point);
//		console.log(p2);
	//console.log(getLatLong(tileCoordinate.x, tileCoordinate.y, zoom));
//	toogleMaps();
//	console.log(tileCoordinate);
	
//	var currentProjection = map.getProjection();
////	var point = currentProjection.fromLatLngToPoint(latlng, zoom);
//var point = event.point;
//console.log(point);
////	console.log(event.latlng);
////	var t = map.getTile();
////	console.log(point);

});
//
//google.maps.event.addListener(map, 'bounds_changed', drawZones);
//google.maps.event.addListener(map, 'bounds_changed', redrawWorld);
//google.maps.event.addListener(map, 'zoom_changed', redrawWorld);


  // Now attach the coordinate map type to the map's registry
  //map.mapTypes.set('coordinate',coordinateMapType);
//	map.overlayMapTypes.insertAt(0, new CoordMapType(new google.maps.Size(256, 256)));  

	
//	google.maps.event.addListener(map, 'click', function() {
//		alert('clear');
//		for (var i = 0; i < zones.length; ++i) {
//			zones[i].setMap(null);
//		}
//	});



//  google.maps.event.addListener(map, 'zoom_changed', function(event) {

//  	var rectangleSize = 0.00020;
//  
//		for (var i = 0; i < zones.length; ++i) {
//			zones[i].setMap(null);
//		}  
//		zones = Array();
//		if (map.zoom < 18) return;
//    // Get the current bounds, which reflect the bounds before the zoom.
//		
//    var mapBounds = map.getBounds();
//    
////    console.log(mapBounds);
//    var sw = mapBounds.getSouthWest();
//    var ne = mapBounds.getNorthEast();    



////	  for (var i = sw.lat(); i < ne.lat(); i += rectangleSize) {
////	    for (var j = sw.lng(); j < ne.lng(); j += rectangleSize) {
////			  var rectangle = new google.maps.Rectangle();
////			  var rectOptions = {
////					strokeColor: "#FF0000",
////					strokeOpacity: 0.8,
////					strokeWeight: 1,
//////					fillColor: "#FF0000",
////					fillOpacity: 0,
////					map: map,
////					bounds: new google.maps.LatLngBounds(new google.maps.LatLng(i, j),	new google.maps.LatLng(i + rectangleSize, j + rectangleSize))
////				};
////	  		rectangle.setOptions(rectOptions);		 
////	  		zones.push(rectangle);
//////	  		break;
////	    }		    
//////	    break;
////  	}
//    console.log(zones.length);

//  });

  // We can now set the map to use the 'coordinate' map type
  //map.setMapTypeId('coordinate');
}
