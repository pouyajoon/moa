var libWorldTools = require('./worldTools');
var WorldZones = require ('./../maps/zones');
var _ = require('underscore');
var Server = require('./../lib/Server');
var moaSchema = require('./../db/moaSchema');

var Step = require('common').step;
var User = require("./user");
var UserModel = moaSchema.UserModel;
var AntModel = moaSchema.AntModel;

//when it's action nodes time
function playActionNodes(currentZone){

  var deleteActionNodes = [];

  for (var i = 0; i < currentZone.actionNodes.length; ++i){
    var actionNode = currentZone.actionNodes[i];
    actionNode.play();
    if (actionNode.shouldBeDeleted()){
      deleteActionNodes.push(i);
    }
  }
  for (i = 0; i < deleteActionNodes.length; ++i){
    currentZone.actionNodes.splice(deleteActionNodes[i], 1);
  }
}

var Game = function(_server, callback){
  this.server = _server;

  this.server.io.sockets.on('connection', function (socket) {
    _.each(this.server.ioActions, function(io_action){
      socket.on(io_action.name, io_action.doAction.bind(socket));
    }.bind(this));
    this.setupSocketActions(socket);

  }.bind(this));

  new WorldZones(function(err, _worldZones){
    if (err) callback(err, null);
    this.worldZones = _worldZones;
    return callback(err, this);
  }.bind(this));

};


Game.prototype.getUserFromSocket = function(socket, callback) {
  var sID = socket.handshake.sessionID;
  this.server.sessionStore.get(sID, function(err, session){
    //console.log("session >", session);
    if (session){
      try
      {
        if (_.isUndefined(session.userID)){
          socket.disconnect();
          return callback({"err" : "user is not in session", "code" : "0"});
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
};

Game.prototype.emitInventory = function(socket) {
  var game = this;
  var inventory = null;
  Step([
    function(next) { game.getUserFromSocket(socket, next); },
    function(_user, next) {
      socket.user = _user;
      socket.user.getInventory(next);
    },
    function(_inventory, next) {_inventory.getAnts(next); },
    function(_ants, next){
      socket.emit('inventory', {"err" : null, "ants" : _ants});
    }
  ], function(err){
    socket.emit('inventory', {"err" : err});
  });
};

Game.prototype.moveAntFromZoneToInventory = function(socket, antID, callback) {
  var game = this;
  var user = null;
  var ant = null;
  var zone = null;
  Step([
    function(next) {game.getUserFromSocket(socket, next); },
    function(_user, next) {
      user = _user;
      var a = new AntModel();
      a.model = AntModel;
      a.hasOne({'_user' : user._id, '_id' : antID}, function(err, exists, ant){
        console.log(err, exists, ant);
        if (exists){
          next(null, ant, next);
        }
      });
    },
    function(_ant, next) {
      ant = _ant;
      console.log('get zone');
      game.worldZones.getZone(ant._zone, next);
    },
    function(_zone, next) {
      zone = _zone;
      console.log("zone", zone);
      zone.removeAnt(ant._id, next);
    },
    function(_ant, next) { inventory.addAnt(ant._id, next); },
    function(_ant, next) {
      //console.log('inventory sent');
      game.emitInventory(socket);
      callback(null);
    }
  ], function(err){
    //console.log('err', err);
    callback(err);
  });
};

Game.prototype.moveAntFromInventoryToZone = function(socket, input, callback) {
  var game = this;
  var zone = null;
  var inventory = null;
  Step([
    function(next){ game.worldZones.getZone(input.zoneID, next); },
    function(_zone, next) {
      zone = _zone;
      game.getUserFromSocket(socket, next);
    },
    function(user, next) { user.getInventory(next); },
    function(inventory, next) { inventory.removeAnt(input.antID, next); },
    function(antRemoved, next) {
      antRemoved.position = input.position;
      zone.addAnt(antRemoved, next);},
    function(ant, next) {
      game.emitInventory(socket);
      return callback(null);
    }
  ], function(err){
    //console.log("ERROR", err);
    return callback(err);
  });
};

Game.prototype.emitAnt = function(socket, antID) {
  var a = new AntModel();
  a.model = AntModel;
  a.hasOne({"_id" : antID}, function(err, exists, ant){
    if (err) return socket.emit("ant", {"err" : err});
    if (!exists) return socket.emit("ant", {"err" : "Ant do not exists"});
    ant.getUser(function(err, user){
      if (err) return socket.emit("ant", {"err" : err});
      var antMessage = {'err': null, 'ant' : ant, 'user' : user};
      antMessage.actions = [];

      this.getUserFromSocket(socket, function(err, sessionUser){
        //console.log(socket.handshake.session.sessionID);
        //console.log('EMIT ANT USER ==', user._id, sessionUser._id);
        if (_.isEqual(user._id, sessionUser._id)){
          antMessage.actions.push('sendToInventory');
        }
        //console.log('emit ant message', antMessage);
        socket.emit('ant', antMessage);
      });
    }.bind(this));
  }.bind(this));
};

Game.prototype.setupSocketActions = function(socket) {
  socket.on('moveAntFromInventoryToZone', function(input, callback){
    this.moveAntFromInventoryToZone(socket, input, callback);
  }.bind(this));

  socket.on('sendToInventory', function(antID){
    moveAntFromZoneToInventory(antID);
  }.bind(this));

  socket.on("gameLoaded", function(zoneID){
    this.emitInventory(socket);
  }.bind(this));

  socket.on("getAnt", function(antID){
    this.emitAnt(socket, antID);
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
};

Game.prototype.close = function() {
  this.server.close();
};

Game.prototype.launch = function() {
  this.gameInterval = setInterval(function(){
    this.tick();
  }.bind(this), 200);
};

Game.prototype.tick = function() {
  //console.log('tick');
  var shouldDelete = [];
  var shouldDeleteNode = [];
  var startTime = (new Date()).getTime();//new Date(milliseconds);
  for (var zID in this.worldZones.allZones){
    var z = this.worldZones.allZones[zID];
    //console.log(z);
    //playActionNodes(z);
    z.playAnts();
  }
  // delete the useless nodes
  var now = (new Date()).getTime();
  var processDuration = now - startTime;
  //  console.log("Game processing time : " + processDuration.toString() + 'ms for ' +  global.ants.length + " ants");
};

Game.prototype.saveToDB = function() {
  this.worldZones.saveToDB();
};

module.exports = Game;