// var C_RED   = '\033[31m';
// var C_BLUE  = '\033[34m';
// var C_RESET = '\033[0m';

// console.error = function(m){
//   console.log(C_RED, "ERROR", C_RESET, m);  
// }

var express = require ('express');
var Queen = require ('./classes/queen');
var Position = require ('./classes/position');
var libAuth = require ('./classes/autentication');

var User = require('./classes/user.js');

var Server = require("./lib/Server.js");
var Game = require('./classes/game');

var pageZoom = {"path" : "/zoom", "view" : "game/home.jade", "renderOptions" : {"drawMode" : 'zoom'}};
var pageMap = {"path" : "/map", "view" : "game/home.jade", "renderOptions" : {"drawMode" : 'map'}};
var pageHome = {"path" : "/", "view" : "game/home.jade", "login" : libAuth.requireLogin, "renderOptions" : {"drawMode" : 'map'}};


var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/moa');  

var serverOptions = {
  port : 8081,
  paths : [pageZoom, pageMap, pageHome]
};

new Server(serverOptions, function(err, _server){
  new Game(_server, function(err, _game){
    console.log("game initialized, error : ", err);
  });
});
