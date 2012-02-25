

var Server = require('./../lib/Server.js');
var assert = require('assert');

var should = require('should'); 
var io = require("socket.io-client");
var CONFIG = require('./utils/config');

function getSocketServerURL(){
	return "http://" + CONFIG.serverConfiguration.host + ":" + CONFIG.serverConfiguration.options.port + "/";
}

describe('Socket.io', function() {

	CONFIG.setupDatabase();

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

	function getZoneTest(done){
		exports.getSecureSocketFromGame({}, function(err, res){
			CONFIG.checkErr(err);
			//console.log('secure socket set');
			res.socketClient.emit('getZone', CONFIG.zoneTaine.id);
			res.socketClient.on('zone', function(zone){
				should.exist(zone, "zone should exist");
				console.log("get zone", zone);
				assert.equal(zone.id, CONFIG.zoneTaine.id, 'wrong zone id');
				//console.log(zone);
				res.socketClient.disconnect();
			});
		}, function(err, res){
			CONFIG.checkErr(err);
			res.server.close();
			done();
		});	
	}

	it('socket get zone', function(done){
		getZoneTest(done);
	});	

	it('get zone with zone already existing in base', function(done){
		require('./test-worldZones').createZoneRueTaine({}, function(err, res){
			CONFIG.checkErr(err);
			getZoneTest(done);
		});
	});		
});


function getSecureSocketFromServerTest(currentNumber, maxNumber, done, next){
	require('./test.game').getHTTPPage({}, function(err, res){
		CONFIG.checkErr(err);			
		getSecureSocketFromHTTPConnection(res, function(err, res){
			CONFIG.checkErr(err);
			res.server.close();
			CONFIG.repeat(currentNumber++, maxNumber, done, getSecureSocketFromServerTest);
		}, currentNumber, maxNumber, done, next);			
	});
}

function getSecureSocketFromGameTest(currentNumber, maxNumber, done, next){
	exports.getSecureSocketFromGame({}, function(err, res){
		CONFIG.checkErr(err);
		res.socketClient.disconnect();
	}, function(err, res){
		CONFIG.checkErr(err);
		res.server.close();
		CONFIG.repeat(currentNumber++, maxNumber, done, next);
	});		
}

exports.getSecureSocketFromGame = function(res, callbackOnConnect, callbackOnDisconnect){
	require('./test.game').getHTTPPageFromGame(res, function(err, res){			
		CONFIG.checkErr(err);
		return getSecureSocketFromHTTPConnection(res, callbackOnConnect, callbackOnDisconnect);
	});
}

function getSecureSocketFromHTTPConnection(res, callbackOnConnect, callbackOnDisconnect){
	var sio_server = getSocketServerURL() + "?session.id=" + encodeURIComponent(res.cookies["session.id"]);
	res.socketClient = io.connect(sio_server, CONFIG.socketIO.options);
	should.exist(res.socketClient, "socket client is null");
	res.socketClient.on('connect', function(data){
		callbackOnConnect(null, res);
	});

	res.socketClient.on('disconnect', function(){
		callbackOnDisconnect(null, res);				
	});		
}