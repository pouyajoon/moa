var libWorldTools = require('./worldTools');
var WorldZones = require ('./../maps/zones');
var _ = require('underscore');
var Server = require('./../lib/Server');
var moaSchema = require('./../db/moaSchema');

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


Game.prototype.getUserFromSessionID = function(sID, callback) {
  this.server.sessionStore.get(sID, function(err, session){
//	console.log("session >", session);
		if (session){
			try
			{
				if (_.isUndefined(session.user)){
					return callback({"err" : "user is not in session", "code" : "0"})
				}
				//var u = session.user;
	//			console.log('user id', session.user._id);
				var u = new UserModel();
				u.model = UserModel;
				u.hasOne({"_id" : session.user._id}, function(err, exists, user){
					//console.log('has user', exists, user.__proto__);
					if (err) return callback(err);					
					if (exists){
						return callback(null, user);
					}  else {
						return callback({"err" : "session user don't exists", "code" : "0"});
					}
				});      									
			} catch (err){
				return callback(err);
			}
		}
	});
};


Game.prototype.emitZone = function(socket){
	//console.log("interval");
	var zEmit = {
		"id" : socket.zone.id,
		"_id" : socket.zone._id,
		"ants" : socket.zone.ants
	};
  socket.emit('zone', zEmit);
}

Game.prototype.setupSocketActions = function(socket) {

	socket.on("gameLoaded", function(zoneID){
		var sID = socket.handshake.sessionID;
		this.getUserFromSessionID(sID, function(err, user){
				if (err) {
					if (err.code != "0"){
						console.log("ERROR>", err);
					}
				}
				socket.user = user;

				if (!_.isUndefined(socket.user)){
				  socket.user.getInventory(function(err, i){
				  	console.log("inventory", i);
				  	socket.emit('inventory', i);
				  });  	
			  }


		}.bind(this));
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