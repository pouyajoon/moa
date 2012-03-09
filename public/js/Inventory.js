var Inventory = function(_game){
  this.game = _game;
  this.game.bindOnSocket('inventory', this.loadInventoryFromSocket.bind(this));
};

Inventory.prototype.loadInventoryFromSocket = function(inventory) {
  console.log('inventory', inventory);
  $("#inventory #inventory-content").html('');

  this.antsByID = {};

  _.each(inventory.ants, function(ant){
    this.antsByID[ant._id] = ant;
    $("#inventory #inventory-content").append('<div class="ant" id="' + ant._id+ '"></div>');
    //this.startAntsDraggable();
    this.disableAntsDraggable();
  }.bind(this));
};

Inventory.prototype.close = function(){
  this.game.unbindOnSocket('inventory');
};

Inventory.prototype.disableAntsDraggable = function() {
  $('#inventory .ant').draggable('destroy');
  $("#inventory .ant").addClass('disable');
};

Inventory.prototype.enableAntsDraggable = function(_gameCanvas) {
  $("#inventory .ant").removeClass('disable');
  this.startAntsDraggable(_gameCanvas);
};

Inventory.prototype.startAntsDraggable = function(_gameCanvas) {
  var camera = _gameCanvas.camera;

  $('#inventory .ant').hover(function(){
    console.log('hover', $(this).data('drag'));
    if (!$(this).data('drag')){
      $(this).css('cursor', 'pointer');
    }
    //
  });

  $('#inventory .ant').each(function(index, antDiv){
    var antID = $(antDiv).attr('id');
    var ant = this.antsByID[antID];
    $(antDiv).bind('mousewheel', function(event, delta) {
      camera.mouseWheel(event, delta);
      return false;
    }.bind(this));

    var diff = null;
    $(antDiv).data('drag', false);
    $(antDiv).draggable({
      "start" : function(event){
        $("#mainScreen").css('cursor', 'none');
        $(this).css('cursor', 'none');
        var startPosition = $(antDiv).offset();
        diff = {"x" : event.pageX - startPosition.left, "y" : event.pageY - startPosition.top};
      },
      "drag" : function(event){
        camera.mouseMove(event);
        $(this).css('cursor', 'none');
        $(antDiv).data('drag', true);
        // $(antDiv).css('position', "absolute!important");
         $(antDiv).css('margin-left', diff.x + "px");
         $(antDiv).css('margin-top', diff.y + "px");
        // $(antDiv).css('left', camera.mouseInDrawZone.x  + "!important");

        var w = ant.size.w;
        var h = ant.size.h;
        if (isInside(camera.mouseInDrawZone, camera.drawZoneSize)){
          w = 1 / camera.scale * ant.size.w;
          h = 1 / camera.scale * ant.size.h;
        }
        $(antDiv).width(w).height(h);

      }.bind(this),
      "stop": function(event) {
        $("#mainScreen").css('cursor', 'default');
        $(antDiv).data('drag', false);
        $(antDiv).css('cursor', 'default');
        if (isInside(camera.mouseInDrawZone, camera.drawZoneSize)){
          $(antDiv).draggable("destroy");
          this.game.emitSocket('moveAntFromInventoryToZone', {"zoneID" : _gameCanvas.getZoneID(), "antID" : antID, "position" : camera.mouseInDrawZone}, function(err){
            console.log("moved", err);
          });
        } else {
          // go back
          $(antDiv).css('margin-left', "0px");
          $(antDiv).css('margin-top', "0px");
          $(antDiv).css("left", "0px").css("top", "0px");
          $(antDiv).width(ant.size.w).height(ant.size.h);
        }

        //$(antDiv).css("position", "absolute").css('left', camera.mousePosition.x).css("top", camera.mousePosition.y);

        //this.game.currentGameCanvas.
      }.bind(this)
    });
  }.bind(this));
};

function isInside(point, square){
  if (point.x <= 0) return false;
  if (point.y <= 0) return false;
  if (point.x >= square.x) return false;
  if (point.y >= square.y) return false;
  return true;
}

Inventory.prototype.draw = function() {
  $('body').append('<div id="inventory"><div class="inventory-title">Inventory</div><div id="inventory-content"></div></div>');
};