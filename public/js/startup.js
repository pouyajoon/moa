$(function(){

  var worldMap = new WorldMap(function(_worldMap){
    _worldMap.hide();
    
    var socketManager = new SocketManager(moa_server, function(_socketManager){
      console.log('socket manager created :', moa_server);      
      var _currentZone = {"x" : 1062511, "y" : 721645};      
      var gameCanvas = new GameCanvas(worldMap, _socketManager, _currentZone, function(){});
    });


  });
});