
function ZonesMapType(tileSize) {
  this.tileSize = tileSize;
}

// max zoom, limited from ROADMAP type
ZonesMapType.prototype.maxZoom = 21;


// when release a til
ZonesMapType.prototype.releaseTile = function(tile) {

};

// when draw a tile
ZonesMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
//  var latlng = tileCoordinateToMiddleLatLng(coord);
  var id = coord.x + '_' + coord.y;

  // create box div
  var div = ownerDocument.createElement('DIV');
  // div.innerHTML = coord.toString();
  div.style.width = this.tileSize.width + 'px';
  div.style.height = this.tileSize.height + 'px';
  div.id = id;
  if (zoom == 21){
    div.style.borderStyle = 'dotted';
    div.style.borderWidth = '1px';
    div.style.borderColor = '#CCC';
  }


  // add real zones
  if (zoom == 21){ //zoom < 21 && zoom > 20
    var realZones = "";
    var size = (21 - zoom) * 2 ;
    for (var i = 0; i < size * size; ++i){

      var left = this.tileSize.width / size * (i % size);
      var top = this.tileSize.height / size * Math.floor(i / size);
      realZones += '<div style="border:1px dotted #F00;width:' + this.tileSize.width / size+ ';height:' + this.tileSize.height / size + ';position:absolute;left:' + left + 'px;top:' + top+ 'px"></div>';
    }
    div.innerHTML += realZones;
  }

 return div;
};
