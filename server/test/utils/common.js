var Step = require('common').step;
var Game = require('../../classes/game');
var Server = require('./../../lib/Server.js');
var _ = require('underscore');
var CONFIG = require('./config');


_.extend(exports, require('./browser'));
_.extend(exports, require('./zones'));
_.extend(exports, require('./user'));



exports.createServer = function(res, callback){
	new Server(CONFIG.serverConfiguration.options, function(err, _server){		
    res.server = _server;    
		return callback(err, res);
	});	
};
exports.createGame = function(res, callback){
  Step([
    function(next) { exports.createServer(res, function(err, res){
     new Game(res.server, function(err, _game){
        res.game = _game;
        return callback(err, res);
      });        
   })},
  ]);
}

exports.getHTTPPage = function(res, callback){
  Step([
    function(next) { exports.createGame(res, next); },
    function(res, next) { exports.browser.createHTTPServer(res, next); },
    function(res, next) {
      exports.browser.doHTTPGETRequest(res, CONFIG.http.sessionUrl, CONFIG.http.options, callback);      
    }
  ]);
}

exports.getHTTPPageFromServer = function(res, callback){
  Step([
    function(next) { exports.createServer(res, next)},
    function(res, next) { exports.browser.createHTTPServer(res, next); },
    function(res, next) {
      exports.browser.doHTTPGETRequest(res, CONFIG.http.sessionUrl, CONFIG.http.options, callback);      
    }
  ]);
}


var io = require("socket.io-client");

exports.getSecureSocketFromGame = function(res, callback){
  exports.getHTTPPage(res, function(err, res){
    var sio_server = CONFIG.getSocketServerURL() + "?session.id=" + encodeURIComponent(res.cookies["session.id"]);
    res.socket = io.connect(sio_server, CONFIG.socketIO.options);  
    res.socket.on('connect', function(data){
      return callback(null, res);
    });
    res.socket.on('disconnect', function(){
      res.game.close();
      res.test.done();
    });     
  })
}
