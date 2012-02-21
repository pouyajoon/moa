
var Game = require('../classes/game');
var Server = require('./../lib/Server.js');
var assert = require('assert');
var should = require('should'); 
var http = require("http");

var CONFIG = require('./utils/config');

describe('Game', function() {

	beforeEach(function(){
		require('./utils/db').loadDB();
		require('./utils/db').clearDB();
	});

	it('start server', function(done){
		new Server(CONFIG.serverConfiguration.options, function(err, _server){
			should.exist(_server, 'server is null');
			_server.close();
			done();
		});
	});

	it('get http page', function(done){
		exports.getHTTPPage(function(_server, httpClient, response, cookies){
			_server.close();
			done();
		});
	});	


	it('get http page cookies mandatory', function(done){
		exports.getHTTPPage(function(_server, httpClient, response, cookies){
			should.exist(cookies, "cookies is null");
			_server.close();
			done();
		});
	});	


	it('get http session id from cookie ', function(done){
		exports.getHTTPPage(function(_server, httpClient, response, cookies){
			should.exist(cookies["session.id"], "session id should be set in cookies");
			_server.close();
			done();
		});
	});	

	it('create game', function(done) {
		exports.setupGame(CONFIG.serverConfiguration.options, function(err, _server, _game){
			should.exist(_server, "server is null");
			should.exist(_game, "game is null");
			_server.close();
			done();			
		});
  });

});

exports.getHTTPPage = function(callback){
	new Server(CONFIG.serverConfiguration.options, function(err, _server){
		doHTTPGetRequest(CONFIG.http.sessionUrl, CONFIG.http.options, function(httpClient, response, cookies){
			callback(_server, httpClient, response, cookies);
		});
	});	
}

exports.getHTTPPageFromGame = function(callback){
	exports.setupGame(CONFIG.serverConfiguration.options, function(err, _server, _game){
		//console.log("game setup");
		doHTTPGetRequest(CONFIG.http.sessionUrl, CONFIG.http.options, function(httpClient, response, cookies){
			//console.log("get request");
			callback(_server, _game, httpClient, response, cookies);
		});
	});	
}

exports.setupGame = function(options, callback){
  new Server(options, function(err, _server){
  	CONFIG.checkErr(err);
  	should.exist(_server, 'server is null');  	
    new Game(_server, function(err, _game){
    	CONFIG.checkErr(err);
    	should.exist(_game, 'game is null');
      callback(err, _server, _game);
    });
  });
}

function doHTTPGetRequest(_url, _options, callback){

	var httpClient = http.createClient(CONFIG.serverConfiguration.options.port, CONFIG.serverConfiguration.host); 
	var request = httpClient.request('GET', _url, _options);
	request.end();
	request.on('response', function (response) {
		var cookies = getCookies(response.headers);
		response.setEncoding('utf8');
		callback(httpClient, response, cookies);
	});
}

function getCookies(_headers){
  var cookies = {};
  _headers["set-cookie"].toString().split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
  });
  return cookies;
}

