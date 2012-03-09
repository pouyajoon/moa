var drawMap = true;

// zoom out from a zone
function zoomOutFromZone(){
//      drawMap = true;
  nodeserver.emit('stopzone');
  $('#mainScreen').fadeOut();
  $('#navigationRight').fadeOut();
  $('#map_canvas').fadeIn(500);
  if (map !== null){
    google.maps.event.trigger(map, 'resize');
    map.setZoom( map.getZoom() );
  }
}

// prepare the navigation button
function createTopNavigation(){
  $('#buttonSubscibe').click(function(){
      if (game.currentZone !== null) {
        nodeserver.emit('createQueen', game.currentZone);
      }
  });
}
