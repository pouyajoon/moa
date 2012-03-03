$(function(){

  startup();
  
});


function startup(){

  $('#map_canvas').height($(window).height());  
  $('#mainScreen').fadeOut();

  new Game(function(err, game){
    console.log("game loaded");    
    game.emitSocket("gameLoaded", {});
  });

  // var worldMap = new WorldMap(function(_worldMap){
  //   switch(DRAW_MODE){
  //     case 'zoom' :
  //       _worldMap.hide(0);            
  //       var zoneID = rueTaineTile.x + "_" + rueTaineTile.y;
  //       console.log("create from zoom", zoneID);
  //       _worldMap.gameCanvas[zoneID] = new GameCanvas(_worldMap, rueTaineTile, function(){});
  //       break;
  //     case 'map' :
  //     default :
  //       $('#mainScreen').fadeOut();
  //       break;
  //   }
  // });

  
}