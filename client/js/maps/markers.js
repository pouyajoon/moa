
// Queen Marker Options 
// START
var imageQueen = new google.maps.MarkerImage(
  '/media/img/marker-colony.png',
  new google.maps.Size(35,50),
  new google.maps.Point(0,0),
  new google.maps.Point(18,50)
);

var imageQueenShadow = new google.maps.MarkerImage(
  '/media/img/marker-colony-shadow.png',
  new google.maps.Size(63,50),
  new google.maps.Point(0,0),
  new google.maps.Point(18,50)
);

var shapeQueen = {
  coord: [18,1,19,2,20,3,21,4,22,5,23,6,24,7,25,8,26,9,27,10,28,11,29,12,30,13,31,14,32,15,33,16,32,17,31,18,30,19,29,20,28,21,27,22,26,23,25,24,24,25,23,26,22,27,21,28,20,29,19,30,18,31,18,32,18,33,18,34,18,35,18,36,18,37,18,38,18,39,18,40,18,41,18,42,18,43,18,44,18,45,18,46,18,47,18,48,18,49,17,49,17,48,17,47,17,46,17,45,17,44,17,43,17,42,17,41,17,40,17,39,17,38,17,37,17,36,17,35,17,34,17,33,17,32,17,31,16,30,15,29,14,28,13,27,12,26,11,25,10,24,9,23,8,22,7,21,6,20,5,19,4,18,3,17,2,16,3,15,4,14,5,13,6,12,7,11,8,10,9,9,10,8,11,7,12,6,13,5,14,4,15,3,16,2,17,1,18,1],
  type: 'poly'
};
//END


// get a queen marker
function getMarkerQueen(){
	var markerQueen = new google.maps.Marker({
		draggable: false,
		raiseOnDrag: false,
		icon: imageQueen,
		shadow: imageQueenShadow,
		shape: shapeQueen,
		map: map,
		position: ruetaine
	});
	
	// when clicked on the queen
	google.maps.event.addListener(markerQueen, 'click', function () {
		var bounds = new google.maps.LatLngBounds();
		bounds.extend(this.getPosition());
		zoomIn(21, this.getPosition());
		map.panToBounds(bounds);      
		var localMarker = this;
		//	toogleMaps();
		//	this.setAnimation(google.maps.Animation.BOUNCE);
		//	setTimeout(function(){		
		//		localMarker.setAnimation(null);
		//	}, 1000)
	
	});	
	return markerQueen;
}


