var libWorldTools = require('./worldTools');
var WorldZones = require ('./../maps/zones');
var _ = require('underscore');
var Server = require('./../lib/Server');

//when it's action nodes time
function playActionNodes(currentZone){

	var deleteActionNodes = Array();

	for (var i = 0; i < currentZone.actionNodes.length; ++i){
		var actionNode = currentZone.actionNodes[i];
		actionNode.play();
		if (actionNode.shouldBeDeleted()){
			deleteActionNodes.push(i);
		}
	}
	for (var i = 0; i < deleteActionNodes.length; ++i){
		currentZone.actionNodes.splice(deleteActionNodes[i], 1);
	}		
}

var Game = function(_server, callback){
	//console.log('creating game');
	this.server = _server;

	this.server.io.sockets.on('connection', function (socket) {
		//console.log('client connected, hi');
		//console.log('A socket with sessionID ', socket.handshake.sessionID, ' connected!');    
		_.each(this.server.ioActions, function(io_action){
		  socket.on(io_action.name, io_action.doAction.bind(socket));
		}.bind(this));
	}.bind(this));

	this.worldZones = new WorldZones(function(err){
		//if (err) throw "error:" + err;
		return callback(null, this);
	}.bind(this));
}


exports.setupGame = function(options, callback){
  new Server(options, function(err, _server){
    new Game(_server, function(err, _game){
      callback(err, _server, _game);
    });
  });
}


Game.prototype.launch = function() {
	this.gameInterval = setInterval(function(){
		this.tick();
	}.bind(this), global.gameTime);			
};

Game.prototype.tick = function() {
	//console.log('tick');
	var shouldDelete = Array();
	var shouldDeleteNode = Array();
	var startTime = (new Date()).getTime();//new Date(milliseconds);
	for (var zID in this.worldZones.allZones){
		var z = this.worldZones.allZones[zID];
		//playActionNodes(z);
		z.playAnts();
	}		
	// delete the useless nodes
	var now = (new Date()).getTime();
	var processDuration = now - startTime;
	//	console.log("Game processing time : " + processDuration.toString() + 'ms for ' +  global.ants.length + " ants");	
};

Game.prototype.saveToDB = function() {
	this.worldZones.saveToDB();
};

module.exports = Game;