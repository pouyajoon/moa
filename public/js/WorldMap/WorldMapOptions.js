var WorldMapOptions = function(){
  //this.mapStyle = [ { featureType: "poi", stylers: [ { visibility: "off" } ] },{ featureType: "road", stylers: [ { visibility: "on" }, { hue: "#4cff00" } ] },{ featureType: "water", stylers: [ { lightness: -25 }, { hue: "#003bff" } ] },{ featureType: "poi.school", stylers: [ { visibility: "on" } ] },{ featureType: "poi.park", stylers: [ { visibility: "on" } ] },{ featureType: "road.highway", elementType: "labels", stylers: [ { visibility: "off" } ] } , { featureType: "poi.park", stylers: [ { visibility: "on" }, { hue: "#2bff00" }, { gamma: 0.31 } ] }];

  this.mapStyle = [ { featureType: "landscape.man_made", stylers: [ { visibility: "off" } ] },{ featureType: "water", stylers: [ { hue: "#0044ff" } ] },{ featureType: "landscape.natural", stylers: [ { gamma: 0.5 }, { hue: "#00ff3c" }, { saturation: 53 }, { lightness: -33 } ] },{ featureType: "poi.park", stylers: [ { hue: "#00ff44" }, { lightness: -40 } ] },{ featureType: "road", stylers: [ { gamma: 2.04 }, { saturation: 28 }, { hue: "#00b2ff" }, { lightness: -42 } ] },{ } ];

  this.options = {
    zoom: 21,
    maxZoom : 21,
    center: ruetaine,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: this.mapStyle
  };
  this.mapOptionsURL = this.loadMapOptionsURL();
};



// transform the map option to string url mode
WorldMapOptions.prototype.loadMapOptionsURL = function(){
  var t = "";
  for (var ftk in this.mapStyle){
    var ft = this.mapStyle[ftk];
    t += '&style=feature:' + ft.featureType;
    if (ft.elementType !== null){
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
};

// get the image URL according to lat long, size & scale will be add later
WorldMapOptions.prototype.getMapImageURL = function(latlng){
  var imgUrl = 'http://maps.googleapis.com/maps/api/staticmap?center=' + latlng.lat()+ ','+ latlng.lng()+ '&zoom=21&sensor=false';
  imgUrl += this.mapOptionsURL;
  return imgUrl;
};