var express = require ('express');
var Queen = require ('./classes/queen');
var Position = require ('./classes/position');
var libAuth = require ('./classes/autentication');

var User = require('./classes/User.js');

var Server = require("./lib/setup.js");

var pageZoom = {"path" : "/zoom", "view" : "game/home.jade", "renderOptions" : {"drawMode" : 'zoom'}};
var pageMap = {"path" : "/map", "view" : "game/home.jade", "renderOptions" : {"drawMode" : 'map'}};
var pageHome = {"path" : "/", "view" : "game/home.jade", "login" : libAuth.requireLogin};

var moaServer = new Server({
  port : 8081,
  paths : [pageZoom, pageMap, pageHome]
});

require ('./classes/autenticationControls')(moaServer.app);

global.uniqueID = 0;
global.gameTime = 200;
global.worldSize = {'x' : 4096, 'y' : 4096};

var Game = require('./classes/game');

setTimeout(function(){


  var user = new User("pouyajoon@gmail.com");

  global.moaGame = new Game(moaServer);
  global.moaGame.launch();
  //Game.worldZones.loadZone("1062511_721646");

  global.moaGame.worldZones.loadZone("1062511_721645", null, function(err, zone){
    //console.log("loadZone", zone);
    var q = new Queen("first-Queen", new Position(2000, 2000));
    zone.ants.push(q);
    console.log("queen-display", q.toString());
  });
}, 0);

