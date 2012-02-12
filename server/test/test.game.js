
var Game = require('../classes/game');
var Server = require('./../lib/Server.js');
var assert = require('assert');
var io = require("socket.io-client");

var rport = 3000;

describe('Game', function() {

	beforeEach(function(){
		require('./utils/db').loadDB();
		require('./utils/db').clearDB();
	});


	it('start server', function(done){
		new Server({"port" : rport}, function(err, _server){
			assert.notEqual(_server, null, "server has not been initialized : " + err);
			_server.app.close();
			done();
		});

	});

	it('create', function(done) {
		new Server({port : rport}, function(err, _server){
			new Game(_server, function(err, _game){
				assert.notEqual(_game, null, "game has not been initialized : " + err);
				_server.app.close();
				done();			
			});
		});
  });

	it('socket io is loaded', function(done) {
		new Server({port : rport}, function(err, _server){
			new Game(_server, function(err, _game){

				var client = io.connect("http://pouya:" + rport);

				client.on('connect', function(data){
					console.log('client connected from test : ', data);
					client.emit('user-subscribe', {"email" : "pouyajoon@gmail.com", "password" : "top"}, function(err){
					  console.log("error:", err);
					  done();			
					});
				});

			
				//_server.app.close();
				//done();			
			});
		});
  });  
});