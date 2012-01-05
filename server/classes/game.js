var libWorldTools = require('./worldTools');
var WorldZones = require ('./../maps/zones');
var _ = require('underscore');

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

// when it's ants time
function playAnts(currentZone) {
	var deleteAnts = Array();
	
	for (var i = 0; i < currentZone.ants.length; ++i){
		var ant = currentZone.ants[i];
		if (ant == null) continue;
		ant.play(currentZone);
		if (ant.shouldBeDeleted()){
			deleteAnts.push(i);
		}		
	}	
	for (var i = 0; i < deleteAnts.length; ++i){
		currentZone.ants.splice(deleteAnts[i], 1);
	}
}

var moaSchema = require('../mongo/moaSchema.js');

var Game = function(_server){
	this.server = _server;
	this.mongoose = require("mongoose");
	this.mongoose.connect('mongodb://localhost/moa');   

	this.worldZones = new WorldZones(this.mongoose);

  this.server.io.sockets.on('connection', function (socket) {
    console.log('client connected');
    _.each(require('./game-sockets.js').ioActions, function(io_action){
      socket.on(io_action.name, io_action.doAction.bind(socket));
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
		playActionNodes(z);
		playAnts(z);
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