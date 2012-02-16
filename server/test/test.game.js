
var Game = require('../classes/game');
var Server = require('./../lib/Server.js');
var assert = require('assert');


var serverConfiguration = {
	"options" : {
	    "port" : 3000,
	    "paths" : []
	},
	"name" : "pouya"
};

var serverTestConf = {"port" : 3000, "name" : "pouya"};

describe('Game', function() {

	beforeEach(function(){
		require('./utils/db').loadDB();
		require('./utils/db').clearDB();
	});

	it('start server', function(done){
		new Server(serverConfiguration.options, function(err, _server){
			assert.notEqual(_server, null, "server has not been initialized : " + err);
			_server.app.close();
			done();
		});
	});

	it('create', function(done) {
		setupGame(function(err, _server, _game){
			assert.notEqual(_game, null, "game has not been initialized : " + err);
			_server.app.close();
			done();			
		});
  });

	it('connect to socket io', function(done) {
		setupSocket(function(err, _server, _game, _client){
			assert.notEqual(_client, null, "socket client should not be null");
			_client.disconnect();
			_server.app.close();
			done();
		});


		// setupGame(function(err, _server, _game){
		// 	console.log('game loaded, error : ', err);

		// 	var io = require("socket.io-client");
		// 	var sio_server = "http://" + serverConfiguration.name + ":" + serverConfiguration.options.port + "/";
		// 	console.log("connecting to socket io server : ", sio_server);
		// 	var client = io.connect(sio_server);			

		// 	client.on('connect', function(data){
		// 		console.log('client connected from test : ', data);
				

		// 		client.disconnect();
		// 		_server.app.close();
		// 		done();
		// 		// client.emit('user-subscribe', {"email" : "pouyajoon@gmail.com", "password" : "crypted_password"}, function(err){
		// 		//   console.log("error:", err);
		// 		//   done();			
		// 		// });
		// 	});
		// });
	});


});


function setupGame(callback){
	new Server(serverConfiguration.options, function(err, _server){
		new Game(_server, function(err, _game){
			callback(err, _server, _game);
		});
	});
}

function setupSocket(callback){
	setupGame(function(err, _server, _game){
		var io = require("socket.io-client");
		var sio_server = "http://" + serverConfiguration.name + ":" + serverConfiguration.options.port + "/";
		var client = io.connect(sio_server);			

		client.on('connect', function(data){
				return callback(err, _server, _game, client);
		});

	});
}