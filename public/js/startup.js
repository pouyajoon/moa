$(function(){

  var worldMap = new WorldMap(function(_worldMap){
    
    
    var socketManager = new SocketManager(moa_server, function(_socketManager){
      console.log('socket manager created :', moa_server);    
      
      switch(DRAW_MODE){
        case 'zoom' :
          _worldMap.hide();
          var _currentZone = {"x" : 1062511, "y" : 721645};      
          var gameCanvas = new GameCanvas(worldMap, _socketManager, _currentZone, function(){});
          break;
        case 'map' :
        default :
          $('#mainScreen').fadeOut();
          break;
      }
        

    });


  });
});