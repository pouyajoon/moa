function moaMap(map) {
	this.map = map;
	this.TILE_SIZE = 256;
	this.mapOptionsURL = this.loadMapOptionsURL(map.styles);
}



// transform tilecoordinate to latlng (top, left);
moaMap.prototype.tileCoordinateToLatLng = function(tileCoordinate){
	var numTiles = 1 << this.map.getZoom();
  var px0 = new google.maps.Point(
      tileCoordinate.x * this.TILE_SIZE,
      tileCoordinate.y * this.TILE_SIZE);
  var pt0 = new google.maps.Point(
      px0.x / numTiles,
      px0.y / numTiles);
	var latlng0 = this.map.getProjection().fromPointToLatLng(pt0);
	return latlng0;
} 


// return the tile coordinate of the mouse click
moaMap.prototype.mouseClickToTileCoordinate = function(point){

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
moaMap.prototype.tileCoordinateToMiddleLatLng = function(tileCoordinate){
	var	latlng0 = this.tileCoordinateToLatLng(tileCoordinate);
	var	latlng1 = this.tileCoordinateToLatLng({'x' : tileCoordinate.x + 1, 'y' : tileCoordinate.y + 1});	
	var latlngmiddle = new google.maps.LatLng(
		latlng0.lat() + (latlng1.lat() - latlng0.lat()) / 2, 
		latlng0.lng() + (latlng1.lng() - latlng0.lng()) / 2);
	return latlngmiddle;
}

// transform the map option to string url mode
moaMap.prototype.loadMapOptionsURL = function(mapStyles){
	var t = "";
	for (var ftk in mapStyles){
		var ft = mapStyles[ftk];
		t += '&style=feature:' + ft.featureType;
		if (ft.elementType != null){
			t += '|elementType:' + ft.elementType;
		}
		for(var i in ft.stylers){
			for(var styleName in ft.stylers[i]){
				var s = ft.stylers[i][styleName];
				if (typeof(s)=='string'){
					s = s.replace("#", '0x');							
				}				
				t += '|' + styleName + ':' + s;
			}
		}
	}
	return t;
}

// get the image URL according to lat long, size & scale will be add later
moaMap.prototype.getMapImageURL = function(latlng){
	var imgUrl = 'http://maps.googleapis.com/maps/api/staticmap?center=' + latlng.lat()+ ','+ latlng.lng()+ '&zoom=21&sensor=false';
	imgUrl += this.mapOptionsURL;
	return imgUrl;
}
