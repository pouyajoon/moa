var Inventory = function(_game){
  this.game = _game;
  this.game.bindOnSocket('inventory', this.loadInventoryFromSocket.bind(this));  
}


Inventory.prototype.loadInventoryFromSocket = function(inventory) {
  console.log('inventory', inventory);
  $("#inventory ul.inventory-content").html('');
  _.each(inventory.ants, function(ant){
    $("#inventory ul.inventory-content").append('<li class="ant"></li>');
    this.startAntsDraggable();
    this.disableAntsDraggable();
  }.bind(this));
};

Inventory.prototype.close = function(){
	this.game.unbindOnSocket('inventory');
}

Inventory.prototype.disableAntsDraggable = function() {
	$('#inventory .ant').draggable('disable');
};

Inventory.prototype.enableAntsDraggable = function() {
	$('#inventory .ant').draggable('enable');
};

Inventory.prototype.startAntsDraggable = function(_gameCanvas) {
	$('#inventory .ant').draggable({
		"revert": true, 
		"helper": "clone",
	  "stop": function(event) {
	  	console.log("stop@", event);
	  }
	});
};

Inventory.prototype.draw = function() {
  $('body').append('<div id="inventory"><div class="inventory-title">Inventory</div><ul class="inventory-content"></ul></div>');
};