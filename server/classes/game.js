var libWorldTools = require('./worldTools');
var WorldZones = require ('./../maps/zones');
var _ = require('underscore');
var Server = require('./../lib/Server');
var moaSchema = require('./../db/moaSchema');

var Step = require('common').step;
var User = require("./user");
var UserModel = User.UserModel;


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
	//console.log("game created:");
	this.server = _server;

	this.server.io.sockets.on('connection', function (socket) {
		//console.log('client connected');

		_.each(this.server.ioActions, function(io_action){
		  socket.on(io_action.name, io_action.doAction.bind(socket));
		}.bind(this));
		this.setupSocketActions(socket);

	}.bind(this));

	new WorldZones(function(err, _worldZones){
		//console.log("worldZones created");
		if (err) callback(err, null);
		this.worldZones = _worldZones;
		return callback(err, this);
	}.bind(this));

}


Game.prototype.getUserFromSocket = function(socket, callback) {
	var sID = socket.handshake.sessionID;
  this.server.sessionStore.get(sID, function(err, session){
		//console.log("session >", session);
		if (session){
			try
			{
				if (_.isUndefined(session.userID)){
					socket.disconnect();
					return callback({"err" : "user is not in session", "code" : "0"})
				}
				//var u = session.user;
				//console.log('get user from session', session);
				var u = new UserModel();
				u.model = UserModel;
				u.hasOne({"_id" : session.userID}, function(err, exists, user){
					//console.log('has user', exists, user.getAn);
					if (err) return callback(err);					
					if (exists){
						return callback(null, user);
					}  else {
						socket.disconnect();
						return callback({"err" : "session user don't exists", "code" : "0"});
					}
				});      									
			} catch (err){
				return callback(err);
			}
		} else {
			return callback({'err' : "no session"});
		}
	});
};


Game.prototype.emitZone = function(socket){
	socket.zone.getAnts(function(err, ants){
		var zEmit = {
			"id" : socket.zone.id,
			"_id" : socket.zone._id,
			"ants" : ants
		};
	  socket.emit('zone', zEmit);
	});
}


Game.prototype.emitInventory = function(socket) {
	var game = this;
	var inventory = null;
	Step([
		function(next) { game.getUserFromSocket(socket, next)},
		function(_user, next) {
			socket.user = _user;
			socket.user.getInventory(next); 
		},
		function(_inventory, next) {_inventory.getAnts(next); },
		function(_ants, next){
			socket.emit('inventory', {"err" : null, "ants" : _ants});
		}
	], function(err){
		return callback(err);
	});
};



Game.prototype.moveAntFromInventoryToZone = function(socket, input, callback) {
	var game = this;
	var zone = null;
	var inventory = null;
	Step([
		function(next){ game.worldZones.getZone(input.zoneID, next) },
		function(_zone, next) { 
			zone = _zone;
			game.getUserFromSocket(socket, next);
		},
		function(user, next) { user.getInventory(next) },
		function(_inventory, next) {
			inventory = _inventory; 
			inventory.getAnts(next);
		},
		function(ants, next) { inventory.removeAnt(ants, input.antID, next); },
		function(antRemoved, next) { zone.addAnt(antRemoved, input.position, next);},
		function(ant, next) {
			game.emitInventory(socket);
			return callback(null);
		}
	], function(err){
		return callback(err);
	});
};

Game.prototype.setupSocketActions = function(socket) {
	socket.on('moveAntFromInventoryToZone', function(input, callback){
		this.moveAntFromInventoryToZone(socket, input, callback);
	}.bind(this));

	socket.on("gameLoaded", function(zoneID){
		this.emitInventory(socket);		
	}.bind(this));

	socket.on("getZone", function(zoneID){
    this.worldZones.getZone(zoneID, function(err, zone){     
      socket.zone = zone;
      socket.interval  = setInterval(function(){
      	this.emitZone(socket);
      }.bind(this), 200);
    }.bind(this)); 
  }.bind(this));
};

exports.setupGame = function(options, callback){
  new Server(options, function(err, _server){
    new Game(_server, function(err, _game){
    	should.exist(_game, "game is null");
    	should.exist(_game.worldZones, "game worldZones is null");
      callback(err, _server, _game);
    });
  });
}

Game.prototype.close = function() {
	this.server.close();
};

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