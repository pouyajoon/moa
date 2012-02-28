
var CONFIG = require('./test/utils/config');
var common = require('./test/utils/common');
var io = require("socket.io-client");

common.createServer({}, function(err, res){
  common.browser.doHTTPGETRequest(res, CONFIG.http.sessionUrl, CONFIG.http.options, function(err, res){
    var sio_server = CONFIG.getSocketServerURL();// + "?session.id=" + encodeURIComponent(res.cookies["session.id"]);
    //console.log(CONFIG.socketIO);
    var s = io.connect(sio_server, CONFIG.socketIO.options);  
    s.on('connect', function(data){
      console.log('getSecureSocketFromHTTPConnection Connect');
      //callbackOnConnect(null, res);
    });

    s.on('error', function(data){
      console.log('getSecureSocketFromHTTPConnection Error');
      //callbackOnConnect(null, res);
    });    

    s.on('disconnect', function(){
      console.log('getSecureSocketFromHTTPConnection Disconnect');
      //test.done();
      //callbackOnDisconnect(null, res);        
    });         
  });    
})





// var http = require('http');
// var client = http.createClient(8081, 'pouya'); // to access this url i need to put basic auth.
// var io = require("socket.io-client");
// var sio_server = "http://pouya:8081/";
// var parseCookie = require('connect').utils.parseCookie;



// var request = client.request('GET', '/users/login',
//   {'host': 'pouya'});
// request.end();
// request.on('response', function (response) {
//   //console.log('STATUS: ' + response.statusCode);
//   //var headers = JSON.stringify(response.headers);
  

//   var cookies = {};
//   response.headers["set-cookie"].toString().split(';').forEach(function( cookie ) {
//     var parts = cookie.split('=');
//     cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
//   });

//   //console.log('HEADERS: ', cookies, cookies["session.id"]);
//   response.setEncoding('utf8');
//   //var cookies = parseCookie(response.headers["set-cookie"]);
//   var client = io.connect(sio_server + "?session.id=" + cookies["session.id"]);

//   client.disconnect();

// 	client.on('connect', function(data){
//     console.log('client connected from test : ', data);
//     client.disconnect();
// 	});

// });

// // var sio = require('socket.io')
// //   , should = require('./common')
// //   , parser = sio.parser
// //   , ports = 8081;



// // var cl = client(ports)
// //   , io = create(cl)
// //   , ws;

// // io.set('transports', ['websocket']);
// // io.sockets.on('connection', function (socket) {
// //   //socket.manager.transports[socket.id].name.should.equal('websocket');
// //   //ws.finishClose();
// //   cl.end();
// //   io.server.close();
// //   //done();
// // });

// // cl.handshake(function (sid) {
// //   ws = websocket(cl, sid);
// // });


// // var io = require("socket.io-client");


// // //var sio_server = "http://" + serverTestConf.name + ":" + serverTestConf.port + "/";
// // var sio_server = "http://pouya:8081/";
// // console.log("try connect to io server : ", sio_server);


// // var client = io.connect(sio_server);


// // // client.disconnect();

// // // client.on("hi", function(){
// // //     console.log("received hi!");
// // // });

// // client.on('connect', function(data){
// //     console.log('client connected from test : ', data);
// //     // client.emit('user-subscribe', {"email" : "pouyajoon2@gmail.com", "password" : "crypted_password"}, function(err){
// //     //   console.log("error:", err);
// //     // //  done();            
// //     // });
// //     client.disconnect();
// // });

// // var test = function(callback){

// // 	process.on('uncaughtException', function (err) {
// // 		return callback(err)
// //   	console.log('test Caught exception: ' + err);
// // 	});

// //     var express = require('express');
// //     var app = express.createServer(function(err){
// //     	console.log("err", err);
// //     });
// //     //app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
// //     app.listen(3000, function(err){
// //     	console.log('listen: ', err);
// //     });
// //     //return callback(null);
// // }


// // try{


// // 	new test(function(err){
// // 		console.log('test created ', err);	
// // 	});
	

// // }
// // catch(err){
// // 	console.log("catched: ", err);
// // }

// // process.on('uncaughtException', function (err) {
// //   console.log('Caught exception: ' + err);
// // });