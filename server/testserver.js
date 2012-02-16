


var Game = require('./classes/game');
var Server = require('./lib/Server.js');

var serverTestConf = {"port" : 3000, "name" : "pouya"};

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/moa'); 



var options = {
    'port' : 3000,
    'paths' : []
};
new Server(options, function(err, _server){
    new Game(_server, function(err, _game){
        console.log('game loaded, error : ', err);

        // var io = require("socket.io-client");
        // var sio_server = "http://" + serverTestConf.name + ":" + serverTestConf.port + "/";
        // console.log("connecting to socket io server : ", sio_server);
        // var client = io.connect(sio_server);
        

        // client.on('connect', function(data){
        //     console.log('client connected from test : ', data);
        //     client.disconnect();
        //     //_server.app.close();
        //     //done();
        //     // client.emit('user-subscribe', {"email" : "pouyajoon@gmail.com", "password" : "crypted_password"}, function(err){
        //     //   console.log("error:", err);
        //     //   done();            
        //     // });
        // });
    });
});


