
var TILE_SIZE = 256;

var ruetaine = new google.maps.LatLng(48.837890444364774, 2.392113855719572);
var rueTaineTile = {"x" : 1062511, "y" : 721645};


function WorldMap(callback) {

  this.ID = "map_canvas";
  this.mapOptions = new WorldMapOptions();
  this.map = new google.maps.Map(document.getElementById(this.ID), this.mapOptions);

  var _zonesMap = new ZonesMapType(new google.maps.Size(256, 256));
  this.map.overlayMapTypes.insertAt(0, _zonesMap);

  MyOverlay.prototype = new google.maps.OverlayView();
  MyOverlay.prototype.onAdd = function() { };
  MyOverlay.prototype.onRemove = function() { };
  MyOverlay.prototype.draw = function() { };
  function MyOverlay(map) { this.setMap(this.map); }

  var overlay = new MyOverlay(this.map);


  new WorldMapGeocoder(this.map);

  var init = true;


  // when map is clicked on zoom 21
  google.maps.event.addListener(this.map, 'click', function(event){
    // zoom click can only be done on zoom 21
    if (this.map.getZoom() != 21) return;
    // get the tile & the middle
    // console.log(event.qa, event.pixel, event.latLng);
    var tileCoordinate = this.mouseClickToTileCoordinate(event.qa);
    var tileCoordinatePos = this.mouseClickToCoordinateInTile(event.qa);
    var latLngMiddle = this.tileCoordinateToMiddleLatLng(tileCoordinate);
    //console.log(event);
    //console.log(event.pixel.x % 256, event.pixel.y % 256);
    // move to the middle of the tile
    //this.map.panTo(latLngMiddle);
    //prepare the moving
    this.onClickInMap(event, tileCoordinate, tileCoordinatePos);

    // setTimeout(function(){
    //   this.hide(0);
    // }.bind(this), 250);
  }.bind(this));



  google.maps.event.addListener(this.map, 'idle', function(event){
    if (init){
      init = false;
      return callback(this);
    }
  }.bind(this));


}

WorldMap.prototype.onClickInMap = function(event, tileCoordinate, tileCoordinatePos){

};



WorldMap.prototype.hide = function(_time) {
  $('#' + this.ID).fadeOut(_time);
};


WorldMap.prototype.show = function(_time, _tileCoordiante) {
  //var _latLng = this.tileCoordinateToMiddleLatLng(_tileCoordiante);
  //this.map.panTo(_latLng);
  $('#' + this.ID).fadeIn(_time);
};


WorldMap.prototype.getImageURLFromTileCoordinate = function(_tileCoordiante) {
  var _latLng = this.tileCoordinateToMiddleLatLng(_tileCoordiante);
  //console.log("_latLng", _latLng, _tileCoordiante);
  //var ln = new google.maps.LatLng('48.838000734940096', '2.3921871185302734');
  return this.mapOptions.getMapImageURL(_latLng);
};

// transform tilecoordinate to latlng (top, left);
WorldMap.prototype.tileCoordinateToLatLng = function(tileCoordinate){
	var numTiles = 1 << this.map.getZoom();
  var px0 = new google.maps.Point(
      tileCoordinate.x * TILE_SIZE,
      tileCoordinate.y * TILE_SIZE);
  var pt0 = new google.maps.Point(
      px0.x / numTiles,
      px0.y / numTiles);
  var p = this.map.getProjection();
  var latlng0 = p.fromPointToLatLng(pt0);
	return latlng0;
};

WorldMap.prototype.mouseClickToCoordinateInTile = function(point){

  var numTiles = 1 << this.map.getZoom();
  var worldCoordinate = point;
  var pixelCoordinate = new google.maps.Point(
      worldCoordinate.x * numTiles,
      worldCoordinate.y * numTiles);

  var tileCoordinatePos = new google.maps.Point(
      Math.floor(pixelCoordinate.x % TILE_SIZE),
      Math.floor(pixelCoordinate.y % TILE_SIZE));
  return tileCoordinatePos;
};

// return the tile coordinate of the mouse click
WorldMap.prototype.mouseClickToTileCoordinate = function(point){

	var numTiles = 1 << this.map.getZoom();
  var worldCoordinate = point;
  var pixelCoordinate = new google.maps.Point(
      worldCoordinate.x * numTiles,
      worldCoordinate.y * numTiles);

  var tileCoordinate = new google.maps.Point(
      Math.floor(pixelCoordinate.x / TILE_SIZE),
      Math.floor(pixelCoordinate.y / TILE_SIZE));

  return tileCoordinate;
};

// get the middle lat lng using tile coordinates
WorldMap.prototype.tileCoordinateToMiddleLatLng = function(tileCoordinate){
	var	latlng0 = this.tileCoordinateToLatLng(tileCoordinate);
	var	latlng1 = this.tileCoordinateToLatLng({'x' : tileCoordinate.x + 1, 'y' : tileCoordinate.y + 1});
	var latlngmiddle = new google.maps.LatLng(
		latlng0.lat() + (latlng1.lat() - latlng0.lat()) / 2,
		latlng0.lng() + (latlng1.lng() - latlng0.lng()) / 2);
	return latlngmiddle;
};


