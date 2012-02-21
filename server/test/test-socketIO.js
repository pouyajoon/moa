

var Server = require('./../lib/Server.js');
var assert = require('assert');

var should = require('should'); 
var io = require("socket.io-client");
var CONFIG = require('./utils/config');


function getSocketServerURL(){
	return "http://" + CONFIG.serverConfiguration.host + ":" + CONFIG.serverConfiguration.options.port + "/";
}

describe('Socket.io', function() {

	beforeEach(function(){
		this.db = require('./utils/db').loadDB();
		require('./utils/db').clearDB();
	});

	afterEach(function(){
		require('./utils/db').closeDB(this.db);
	});


	function getSocket(currentNumber, maxNumber, done, next){
		require('./test.game').getHTTPPage(function(_server, _httpClient, _response, cookies){			

			var sio_server = getSocketServerURL() + "?session.id=" + encodeURIComponent(cookies["session.id"]);
			//console.log("connect to ", sio_server);
			var socketClient = io.connect(sio_server, CONFIG.socketIO.options);
			should.exist(socketClient, "socket client is null");
			socketClient.on('connect', function(data){
				//console.log('client connected');
				socketClient.disconnect();
			});

			socketClient.on('disconnect', function(){
				//console.log('client disconnected');
				_server.close();
				CONFIG.repeat(currentNumber + 1, maxNumber, done, next);	
				
			});
		});		
	}

	it('get secure socket client from server', function(done){
		CONFIG.repeat(0, 0, done, getSocket);
	});

	it('get secure socket client from server 200 times', function(done){
		CONFIG.repeat(0, 200, done, getSocket);
	});



	function getSecureSocketFromGameTest(currentNumber, maxNumber, done, next){
		exports.getSecureSocketFromGame(function(_server, _game, _socketClient, _httpClient, _response){
			_socketClient.on('connect', function(data){
				//console.log("httpclient", _httpClient);
				_response.destroy();
				_game.close();
				setTimeout(function(){
					CONFIG.repeat(currentNumber++, maxNumber, done, next);
				}, 0);
				//_socketClient.disconnect();
			});	
			_socketClient.on('disconnect', function(){
				console.log("client disconnected");
			});
		});		
	}

	it('get secure socket client from game', function(done){
		CONFIG.repeat(0, 0, done, getSecureSocketFromGameTest);
	});

	it('get secure socket client from game 200 times', function(done){
		CONFIG.repeat(0, 12, done, getSecureSocketFromGameTest);
	});


});

exports.getSecureSocketFromGame = function(callback){
	require('./test.game').getHTTPPageFromGame(function(_server, _game, _httpClient, _response, cookies){			
		//console.log("cookies", cookies);
		var sio_server = getSocketServerURL() + "?session.id=" + encodeURIComponent(cookies["session.id"]);
		
		var socketClient = io.connect(sio_server, CONFIG.socketIO.options);
		console.log(cookies["session.id"], socketClient.socket.options.query);
		//console.log("connect to ", sio_server, socketClient);
		should.exist(socketClient, "socket client is null");		
		return callback(_server, _game, socketClient, _httpClient, _response);
	});
}