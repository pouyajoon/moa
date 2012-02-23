

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

	it('get secure socket client from server', function(done){
		CONFIG.repeat(0, 0, done, getSecureSocketFromServerTest);
	});

	it('get secure socket client from server 150 times', function(done){
		CONFIG.repeat(0, 150, done, getSecureSocketFromServerTest);
	});

	it('get secure socket client from game', function(done){
		CONFIG.repeat(0, 0, done, getSecureSocketFromGameTest);
	});

	it('get secure socket client from game 100 times', function(done){
		CONFIG.repeat(0, 100, done, getSecureSocketFromGameTest);
	});

	it('get zone', function(done){
		exports.getSecureSocketFromGame({}, function(res){
			res.socketClient.emit('getZone', CONFIG.zoneTaine.id);
			res.socketClient.on('zone', function(zone){
				should.exist(zone, "zone should exist");
				assert.equal(zone.data.id, CONFIG.zoneTaine.id);
				//console.log(zone);
				res.socketClient.disconnect();
			});
		}, function(res){
			res.server.close();
			done();
		});	
	});	


});


	function getSecureSocketFromServerTest(currentNumber, maxNumber, done, next){
		require('./test.game').getHTTPPage({}, function(res){			
			getSecureSocketFromHTTPConnection(res, function(res){
				res.server.close();
				CONFIG.repeat(currentNumber++, maxNumber, done, getSecureSocketFromServerTest);
			}, currentNumber, maxNumber, done, next);			
		});
	}

function getSecureSocketFromGameTest(currentNumber, maxNumber, done, next){
	exports.getSecureSocketFromGame({}, function(res){
		res.socketClient.disconnect();
	}, function(res){
		res.server.close();
		CONFIG.repeat(currentNumber++, maxNumber, done, next);
	});		
}

exports.getSecureSocketFromGame = function(res, callbackOnConnect, callbackOnDisconnect){
	require('./test.game').getHTTPPageFromGame(res, function(res){			
		return getSecureSocketFromHTTPConnection(res, callbackOnConnect, callbackOnDisconnect);
	});
}

function getSecureSocketFromHTTPConnection(res, callbackOnConnect, callbackOnDisconnect){
	var sio_server = getSocketServerURL() + "?session.id=" + encodeURIComponent(res.cookies["session.id"]);
	res.socketClient = io.connect(sio_server, CONFIG.socketIO.options);
	should.exist(res.socketClient, "socket client is null");
	res.socketClient.on('connect', function(data){
		callbackOnConnect(res);
	});

	res.socketClient.on('disconnect', function(){
		callbackOnDisconnect(res);				
	});		
}