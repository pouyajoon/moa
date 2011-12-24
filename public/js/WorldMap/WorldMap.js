function WorldMap(callback) {
	
  this.ID = "map_canvas";
  this.mapOptions = new WorldMapOptions();
  this.map = new google.maps.Map(document.getElementById(this.ID), this.mapOptions);

  var _zonesMap = new ZonesMapType(new google.maps.Size(256, 256));
  this.map.overlayMapTypes.insertAt(0, _zonesMap);


  MyOverlay.prototype = new google.maps.OverlayView();
  MyOverlay.prototype.onAdd = function() { }
  MyOverlay.prototype.onRemove = function() { }
  MyOverlay.prototype.draw = function() { }
  function MyOverlay(map) { this.setMap(this.map); }

  var overlay = new MyOverlay(this.map);

  var init = true;
  google.maps.event.addListener(this.map, 'idle', function(event){
    if (init){
      callback(this);  
      init = false;
    }    
  }.bind(this));



  // when map is clicked on zoom 21
  google.maps.event.addListener(map, 'click', function(event){
    // zoom click can only be done on zoom 21
    if (map.getZoom() != 21) return;
    // get the tile & the middle
    var tileCoordinate = myMoaMap.mouseClickToTileCoordinate(event.point);
    var latLngMiddle = myMoaMap.tileCoordinateToMiddleLatLng(tileCoordinate);
    // move to the middle of the tile
    map.panTo(latLngMiddle);
    // prepare the moving



//    zoomInZonePrepare(tileCoordinate, latLngMiddle);
    // set active Pan
    var panToActive = true;
    // zoom when moves end  
    google.maps.event.addListener(map, 'idle', function(event){
      if (!panToActive) return;
      setTimeout(function(){
        var _currentZone = {"x" : 1062511, "y" : 721645};      
        var gameCanvas = new GameCanvas(worldMap, _socketManager, _currentZone, function(){});
        gameCanvas.show();
        _worldMap.hide();


        panToActive = false;
      }, 250);    
    });    
  }.bind(this));


	this.TILE_SIZE = 256;

  
}

WorldMap.prototype.hide = function() {
  $('#' + this.ID).fadeOut();
};


WorldMap.prototype.getImageURLFromTileCoordinate = function(_tileCoordiante) {
  var _latLng = this.tileCoordinateToLatLng(_tileCoordiante);
  var ln = new google.maps.LatLng('48.838000734940096', '2.3921871185302734');
  return this.mapOptions.getMapImageURL(ln);
};

// transform tilecoordinate to latlng (top, left);
WorldMap.prototype.tileCoordinateToLatLng = function(tileCoordinate){
	var numTiles = 1 << this.map.getZoom();
  var px0 = new google.maps.Point(
      tileCoordinate.x * this.TILE_SIZE,
      tileCoordinate.y * this.TILE_SIZE);
  var pt0 = new google.maps.Point(
      px0.x / numTiles,
      px0.y / numTiles);      
  var p = this.map.getProjection();
  var latlng0 = p.fromPointToLatLng(pt0);
	return latlng0;
} 


// return the tile coordinate of the mouse click
WorldMap.prototype.mouseClickToTileCoordinate = function(point){

	var numTiles = 1 << this.map.getZoom();
  var worldCoordinate = point;
  var pixelCoordinate = new google.maps.Point(
      worldCoordinate.x * numTiles,
      worldCoordinate.y * numTiles);
     
  var tileCoordinate = new google.maps.Point(
      Math.floor(pixelCoordinate.x / this.TILE_SIZE),
      Math.floor(pixelCoordinate.y / this.TILE_SIZE));
  return tileCoordinate;
}

// get the middle lat lng using tile coordinates
WorldMap.prototype.tileCoordinateToMiddleLatLng = function(tileCoordinate){
	var	latlng0 = this.tileCoordinateToLatLng(tileCoordinate);
	var	latlng1 = this.tileCoordinateToLatLng({'x' : tileCoordinate.x + 1, 'y' : tileCoordinate.y + 1});	
	var latlngmiddle = new google.maps.LatLng(
		latlng0.lat() + (latlng1.lat() - latlng0.lat()) / 2, 
		latlng0.lng() + (latlng1.lng() - latlng0.lng()) / 2);
	return latlngmiddle;
}


