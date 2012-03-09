
// // init the zones
// var allZones = Array();
// var zoneSize = 0.00020;
// var worldSizeLat = 25;
// var worldSizeLng = 50;
// var worldSW = new google.maps.LatLng(48.835, 2.390);
// var worldNE = new google.maps.LatLng(worldSW.lat() + zoneSize * worldSizeLat, worldSW.lng() + zoneSize * worldSizeLng);

// var mapCanvasStub = {};
// var map = {};
// var myMoaMap = null;
// var chicago = new google.maps.LatLng(41.850033,-87.6500523);




// var zones = Array();
// var allTiles = {};

// // create the zone Map overlay
// var ZonesMap = new ZonesMapType(new google.maps.Size(256, 256));


// // zoomIn function, allow to do the ZoomIn to a marker
// function zoomIn(ENDZOOM, center) {
// //       console.log(center);
//         if( map.getZoom() < ENDZOOM ) {
//                 map.setZoom(map.getZoom() + 2);
//                 map.panTo(center);
//                 setTimeout("zoomIn(21, new google.maps.LatLng(" + center.lat() + ", " + center.lng() + "))", 500);
//         }
// }


// // prepare the map
// function initializeMap() {
//   //{ featureType: "landscape.natural", stylers: [ { visibility: "on" }, { gamma: 0.6 }, { hue: "#00ff19" }, { lightness: -60 }, { saturation: 37 } ] }
//   var mapStyle = [ { featureType: "poi", stylers: [ { visibility: "off" } ] },{ featureType: "road", stylers: [ { visibility: "on" }, { hue: "#4cff00" } ] },{ featureType: "water", stylers: [ { lightness: -25 }, { hue: "#003bff" } ] },{ featureType: "poi.school", stylers: [ { visibility: "on" } ] },{ featureType: "poi.park", stylers: [ { visibility: "on" } ] },{ featureType: "road.highway", elementType: "labels", stylers: [ { visibility: "off" } ] } , { featureType: "poi.park", stylers: [ { visibility: "on" }, { hue: "#2bff00" }, { gamma: 0.31 } ] }];
//   //{ featureType: "landscape.natural", stylers: [ { visibility: "on" }, { gamma: 0.6 }, { hue: "#00ff19" }, { lightness: -60 }, { saturation: 37 } ] }

//   var mapOptions = {
//     zoom: 15,
//     maxZoom : 21,
//     center: worldSW,
//     mapTypeId: google.maps.MapTypeId.ROADMAP,
//     styles: mapStyle
//   };

//   // create the map
//   map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
//   //console.log(map);


//   // create the moa MAP
//  //myMoaMap = new moaMap(map);
//  //myMoaMap.loadMapOptionsURL(map.styles);
//  // add zones overlay
//  map.overlayMapTypes.insertAt(0, ZonesMap);

//  mapCanvasStub = function (map) { this.setMap(map); }  // start building overlay stub
//  mapCanvasStub.prototype = new google.maps.OverlayView();
//  mapCanvasStub.prototype.draw = function() {};
//  mapCanvasStub = new mapCanvasStub(map);

//  var marker = getMarkerQueen();

//  // when map is clicked on zoom 21
//  google.maps.event.addListener(map, 'click', function(event){
//    // zoom click can only be done on zoom 21
//    if (map.getZoom() != 21) return;


//     var tileCoordinate = myMoaMap.mouseClickToTileCoordinate(event.point);
//     var latLngMiddle = myMoaMap.tileCoordinateToMiddleLatLng(tileCoordinate);
//     zoomInZonePrepare(tileCoordinate, latLngMiddle);
//     setTimeout(function(){
//       zoomInZone();
//     }, 250);
//     /*
//     // get the tile & the middle

//    // move to the middle of the tile
//    map.panTo(latLngMiddle);
//    // prepare the moving
//    // set active Pan
//    var panToActive = true;
//    // zoom when moves end
//    google.maps.event.addListener(map, 'idle', function(event){
//      if (!panToActive) return;
//      setTimeout(function(){
//        zoomInZone();
//        panToActive = false;
//      }, 250);
//    });
//     */

//  });
// var p = map.getProjection();
// console.log(p);
// }
