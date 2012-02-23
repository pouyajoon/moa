
var Game = require('../classes/game');
var Server = require('./../lib/Server.js');
var assert = require('assert');
var should = require('should'); 
var http = require("http");

var CONFIG = require('./utils/config');

describe('Game', function() {

	beforeEach(function(){		
		this.db = require('./utils/db').loadDB();
		require('./utils/db').clearDB();
	});

	afterEach(function(){
		require('./utils/db').closeDB(this.db);
	});

	it('start server', function(done){
		var res = {};
		new Server(CONFIG.serverConfiguration.options, function(err, _server){
			res.server = _server;
			should.exist(res.server, 'server is null');
			res.server.close();
			done();
		});
	});

	it('get http page', function(done){
		exports.getHTTPPage({}, function(res){
			res.server.close();
			done();
		});
	});	


	it('get http page cookies mandatory', function(done){
		exports.getHTTPPage({}, function(res){
			should.exist(res.cookies, "cookies is null");
			res.server.close();
			done();
		});
	});	



	it('get http session id from cookie', function(done){
		CONFIG.repeat(0, 0, done, getSessionID);
	});	

	it('get http session id with cookie 200 times', function(done){
		CONFIG.repeat(0, 200, done, getSessionID);
	});		

	it('create game', function(done) {
		exports.setupGame({}, CONFIG.serverConfiguration.options, function(err, res){
			res.game.close();
			done();			
		});
  });


	describe('HTTP Client', function() {
		checkRoute("/users/login");
		checkRoute("/");
	});

});

function getSessionID(currentNumber, maxNumber, done, next){
	exports.getHTTPPage({}, function(res){
		should.exist(res.cookies["session.id"], "session id should be set in cookies");
		res.server.close();
		CONFIG.repeat(currentNumber, maxNumber, done, next);
	});			
}

function checkRoute(_route){
	it("check " + _route + " route", function(done) {
		exports.getHTTPPage({}, function(res){
		 	res.response.on('data', function(chunk) {
		 		should.equal(chunk.indexOf("Cannot GET " + _route), -1, "Cannot GET " + _route + " !!!");
		 		res.server.close();
		 		done();
		  });				
		});
	});
}

exports.getHTTPPage = function(res, callback){
	new Server(CONFIG.serverConfiguration.options, function(err, _server){
		res.server = _server;
		exports.doHTTPGETRequest(res, CONFIG.http.sessionUrl, CONFIG.http.options, function(res){
			//console.log("headers", response.headers);
			callback(res);
		});
	});	
}

exports.getHTTPPageFromGame = function(res, callback){
	exports.setupGame(res, CONFIG.serverConfiguration.options, function(err, res){
		//console.log("game setup");
		exports.doHTTPGETRequest(res, CONFIG.http.sessionUrl, CONFIG.http.options, function(res){
			//console.log("get request");
			callback(res);
		});
	});	
}

exports.setupGame = function(res, options, callback){
  new Server(options, function(err, _server){
  	CONFIG.checkErr(err);
  	should.exist(_server, 'server is null');  	
    res.server = _server;
    new Game(res.server, function(err, _game){
    	CONFIG.checkErr(err);
    	should.exist(_game, 'game is null');
    	res.game = _game;
      callback(err, res);
    });
  });
}

exports.doHTTPPOSTRequest = function(res, _url, _headers, _body, callback){
	res.httpClient = http.createClient(CONFIG.serverConfiguration.options.port, CONFIG.serverConfiguration.host); 
	//console.log("url:" + _url);
	var bodyData = JSON.stringify(_body);
	//console.log(bodyData);
	_headers['Content-Type'] = 'application/json';
	_headers['Content-Length'] =  Buffer.byteLength(bodyData,'utf8');
	res.request = res.httpClient.request('POST', _url, _headers);	
	//console.log(request);

	
	res.request.on('response', function (response) {
		//console.log(response);
		//console.log('flash', response.flash());
	 	res.response = response;
	 	// res.response.on('data', function(chunk) {
	 	// 	console.log(chunk, res.response.headers, response.warn);
	  //   // do what you do
	  // });		
		// response.on('end', function() {
		// });
		res.cookies = getCookies(res.response.headers);
		res.response.setEncoding('utf8');
		callback(res);
	});
	res.request.write(bodyData);
//	request.close();
	res.request.end();
	//done();

}

exports.doHTTPGETRequest = function(res, _url, _headers, callback){
	res.httpClient = http.createClient(CONFIG.serverConfiguration.options.port, CONFIG.serverConfiguration.host); 
	var request = res.httpClient.request('GET', _url, _headers);
	request.on('response', function (response) {
		res.response = response;
		response.on('end', function() {
				//console.log("http response end");
		});
		res.cookies = getCookies(res.response.headers);
		res.response.setEncoding('utf8');
		callback(res);
	});
	request.end();
}

function getCookies(_headers){
  var cookies = {};
  _headers["set-cookie"].toString().split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
  });
  return cookies;
}

