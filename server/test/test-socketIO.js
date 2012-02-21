

var Server = require('./../lib/Server.js');
var assert = require('assert');
var io = require("socket.io-client");
var should = require('should'); 

var CONFIG = require('./utils/config');


function getSocketServerURL(){
	return "http://" + CONFIG.serverConfiguration.host + ":" + CONFIG.serverConfiguration.options.port + "/";
}

describe('Socket.io', function() {

	beforeEach(function(){
		require('./utils/db').loadDB();
		require('./utils/db').clearDB();
		CONFIG.serverConfiguration.options.port++;
	});

	it('get secure socket client from server', function(done){
		require('./test.game').getHTTPPage(function(_server, _httpClient, _response, cookies){			
			var sio_server = getSocketServerURL() + "?session.id=" + encodeURIComponent(cookies["session.id"]);
			//console.log("connect to ", sio_server);
			var socketClient = io.connect(sio_server);		
			should.exist(socketClient, "socket client is null");
			socketClient.on('connect', function(data){
				//console.log('client connected');
				socketClient.disconnect();
			});

			socketClient.on('disconnect', function(){
				//console.log('client disconnected');
				_server.close();
				done();
			});
		});
	});

	it('get secure socket client from game', function(done){

		exports.getSecureSocketFromGame(function(_server, _game, _socketClient, _httpClient, _response){
			//console.log("getsocket");

			_socketClient.on('connect', function(data){
				//console.log('client connected');
				_socketClient.disconnect();
			});	

			_socketClient.on('disconnect', function(){
				//console.log('client disconnected');
				_server.close();
				done();
			});
		});
	});

});

exports.getSecureSocketFromGame = function(callback){
	require('./test.game').getHTTPPageFromGame(function(_server, _game, _httpClient, _response, cookies){			
		//console.log("cookies", cookies);
		var sio_server = getSocketServerURL() + "?session.id=" + encodeURIComponent(cookies["session.id"]);
		//console.log("connect to ", sio_server);
		var socketClient = io.connect(sio_server);
		should.exist(socketClient, "socket client is null");		
		return callback(_server, _game, socketClient, _httpClient, _response);
	});
}