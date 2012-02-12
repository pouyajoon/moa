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

var Server = require("./lib/Server.js");

var pageZoom = {"path" : "/zoom", "view" : "game/home.jade", "renderOptions" : {"drawMode" : 'zoom'}};
var pageMap = {"path" : "/map", "view" : "game/home.jade", "renderOptions" : {"drawMode" : 'map'}};
var pageHome = {"path" : "/", "view" : "game/home.jade", "login" : libAuth.requireLogin, "renderOptions" : {"drawMode" : 'map'}};

// process.on('uncaughtException', function (err) {
//   console.log('Caught exception: ' + err);
// });

new Server({
  port : 8081,
  paths : [pageZoom, pageMap, pageHome]
}, function(err, _server){
  //console.log("created server, err :", err);
  if (err) {
    console.error("unable to create the server");// : {", err, "}");
    throw err; 
  }
  //console.log("server loaded");
  require ('./classes/autenticationControls')(_server);

  _server.setRoutes();

  global.uniqueID = 0;
  global.gameTime = 200;
  global.worldSize = {'x' : 4096, 'y' : 4096};

  var Game = require('./classes/game');
  setTimeout(function(){
    try{
      global.moaGame = new Game(_server, function(err, game){
        console.log("game initialized, error : ", err);

        //var io = require("socket.io-client");
        //var client = io.connect("http://pouya:" + _server.options.port + '?noauth=true');
        // var client = io.connect("http://pouya:" + _server.options.port);
        

        // client.on('connect', function(data){
        //   console.log('client connected from test : ', data);
        //   client.emit('user-subscribe', {"email" : "pouyajoon@gmail.com", "password" : "top"}, function(err){
        //     console.log("error:", err);
        //     done();     
        //   });
        // });




        // game.launch();
        // game.worldZones.getZone("1062511_721645", function(err, zone){
        //   if (err) console.error("impossible to get the zone " + err.err);
        // });
      });
    } catch (err){
      console.log("ERROR", C_RED, err.message, C_RESET);
    }
  }, 0);
});

