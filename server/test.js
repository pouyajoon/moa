








var io = require("socket.io-client");


//var sio_server = "http://" + serverTestConf.name + ":" + serverTestConf.port + "/";
var sio_server = "http://pouya:8081/";
console.log("try connect to io server : ", sio_server);


var client = io.connect(sio_server);


// client.disconnect();

// client.on("hi", function(){
//     console.log("received hi!");
// });

client.on('connect', function(data){
    console.log('client connected from test : ', data);
    // client.emit('user-subscribe', {"email" : "pouyajoon2@gmail.com", "password" : "crypted_password"}, function(err){
    //   console.log("error:", err);
    // //  done();            
    // });
    client.disconnect();
});

// var test = function(callback){

// 	process.on('uncaughtException', function (err) {
// 		return callback(err)
//   	console.log('test Caught exception: ' + err);
// 	});

//     var express = require('express');
//     var app = express.createServer(function(err){
//     	console.log("err", err);
//     });
//     //app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
//     app.listen(3000, function(err){
//     	console.log('listen: ', err);
//     });
//     //return callback(null);
// }


// try{


// 	new test(function(err){
// 		console.log('test created ', err);	
// 	});
	

// }
// catch(err){
// 	console.log("catched: ", err);
// }

// process.on('uncaughtException', function (err) {
//   console.log('Caught exception: ' + err);
// });