var MiniMap = function(parentID){
  this.parent = $('#' + parentID);
  this.create();
};

MiniMap.prototype.create = function() {
  var output = [];
  output.push('<canvas id="gameMiniMap"></canvas>');
  this.parent.append(output.join(''));
};


MiniMap.prototype.hide = function() {
  $("#gameMiniMap").fadeOut(500);
};

MiniMap.prototype.setBackgroundImage = function(backgroundImageSource) {
  $("#gameMiniMap").css('background-image', 'url("' + backgroundImageSource + '")');
};