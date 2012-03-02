var Inventory = function(){
  
}

Inventory.prototype.draw = function() {
  $('body').append('<div id="inventory"><div class="inventory-title">Inventory</div><ul class="inventory-content"></ul></div>');
};