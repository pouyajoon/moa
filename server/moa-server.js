var C_RED   = '\033[31m';
var C_BLUE  = '\033[34m';
var C_RESET = '\033[0m';



console.error = function(m){
  console.log(C_RED, "ERROR", C_RESET, m);  
}

var express = require ('express');
var Queen = require ('./classes/queen');
var Position = require ('./classes/position');
var libAuth = require ('./classes/autentication');

var User = require('./classes/user.js');

var Server = require("./lib/setup.js");

var pageZoom = {"path" : "/zoom", "view" : "game/home.jade", "renderOptions" : {"drawMode" : 'zoom'}};
var pageMap = {"path" : "/map", "view" : "game/home.jade", "renderOptions" : {"drawMode" : 'map'}};
var pageHome = {"path" : "/", "view" : "game/home.jade", "login" : libAuth.requireLogin, "renderOptions" : {"drawMode" : 'map'}};

var moaServer = new Server({
  port : 8081,
  paths : [pageZoom, pageMap, pageHome]
});

require ('./classes/autenticationControls')(moaServer);

moaServer.setRoutes();

global.uniqueID = 0;
global.gameTime = 200;
global.worldSize = {'x' : 4096, 'y' : 4096};

var Game = require('./classes/game');


// var md5 = require('crypto').createHash('md5');
// var a = md5.update("a").diget('hex');
// console.log('a : ', a);

setTimeout(function(){

  try{
    // var user = new User("pouyajoon@gmail.com");    
    // user.saveToDB(function(err){
    //   if (err) {
    //     console.error(err.message);
    //   };
    // });

    global.moaGame = new Game(moaServer, function(err, game){
      console.log("game initialized, error : ", err);
      game.launch();
      //console.log(game);
      game.worldZones.getZone("1062511_721645", function(err, zone){
        if (err) console.error("impossible to get the zone " + err.err);
        //console.log("getting zone", zone);
        
        var u = new User("p1@p.com", "top");
        u.saveToDB(function(err){
          if (err) console.error(err.err);
        });

        //require('./db/moaSchema').ZoneSchema

        var Ant = require("./classes/ant");
        var a = new Ant(new Position(2000, 2000), {"w" : 50, "h" : 50});
        a.saveToDB(function(err){
          if (err) console.error("unable to save ant");
          console.log("ant saved");
        });
        zone.addAnt(a);
        zone.saveToDB(function(err){});
        // zone.removeAnt(0);
        // zone.saveToDB(function(err){});
        // zone.ants.push(a);
        // console.log("ant-display", a.toString());
      });
                
    });
    //Game.worldZones.loadZone("1062511_721646");

  } catch (err){
    console.log("ERROR", C_RED, err.message, C_RESET);
  }
}, 0);

