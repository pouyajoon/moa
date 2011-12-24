var express = require ('express');

//require ('v8-profiler');
var lib_ant = require ('./classes/ant');
var lib_queen = require ('./classes/queen');

var lib_position = require ('./classes/position');
var lib_actionNode = require ('./classes/actionNode');
//var camera = require ('./classes/camera');
var libAuth = require ('./classes/autentication');
var libZones = require ('./maps/zones');


var libWorldTools = require ('./classes/worldTools');
var fs = require ('fs');

var app = express.createServer();
var io = require('socket.io').listen(app);
io.set('log level', 1);

var port = 8081;
app.listen(port);
app.set ('views', __dirname + '/views');
app.set ('view engine', 'jade');


var webServer = "masterofants.com:" + port;
app.configure('dev', function(){
  webServer = "localhost:" + port;
});

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.static(__dirname + '/../public'));
    app.use(express.session({secret:"grand mere"}));
    app.use(app.router);
		app.use(express.errorHandler({ dump: true, stack: true }));

});


require ('./classes/autenticationControls')(app);

app.dynamicHelpers({
	'session' : function(req, res) {
		return req.session;
	},
	'flash' : function(req, res) {
		return req.flash();
	}

});

global.uniqueID = 0;
global.gameTime = 200;
global.worldSize = {'x' : 4096, 'y' : 4096};
global.worldZones = new libZones.WorldZones();
require('./classes/game').launchGame(global.worldZones);


var z = global.worldZones.loadZone("1062511_721645");

for (var i = 0; i < 20; ++i){
  var q = new lib_queen.Queen("first-Queen", new lib_position.Position(2000, 2000));
  z.ants.push(q);
}

//var sendingZones = null;

io.sockets.on('connection', function (socket) {
	console.log('client connected');

	socket.on('ssetaction', function(req){
		var z = global.worldZones.loadZone(req.zoneid);
		var floatCamera = camera.createFloatCamera(req.camera);
		var p = {'x' : parseFloat(req.x), 'y' : parseFloat(req.y)};
		var newPos = libWorldTools.transformToRealPosition(p, floatCamera);
		console.log(req.zoneid);
		z.actionNodes.push(new lib_actionNode.ActionNode(req.action, newPos))
	});

	socket.on('createQueen', function(zoneID){
		console.log('queen creation on ' + zoneID);
		var z = global.worldZones.loadZone(zoneID);
		var q = new lib_queen.Queen("first-Queen", new lib_position.Position(2000, 2000));
		z.ants.push(q);
	});


	socket.on('getzone', function(zone_id){
		var sendingZones = setInterval(function () {
				var z = global.worldZones.loadZone(zone_id);
				console.log("send zone : " + z.id);
		  	socket.emit('zone', z);
		}, 200);
    socket.set('sendingZones', sendingZones, function () {});
	});

	socket.on('stopzone', function(zone_id){
    socket.get('sendingZones', function (err, z) {
    	console.log('stop sending : ' + z);
      clearInterval(z);
    });
	});

//  socket.emit('idle', {});
});


app.get('/zoom', function(req, res){
  
  res.render("game/home.jade", {
    layout:false, 
    'title' : 'Master Of Ants',
    server: 'http://' + webServer + '/',
    drawMode : 'zoom'
  });
});

app.get('/map', function(req, res){
  
  res.render("game/home.jade", {
    layout:false, 
    'title' : 'Master Of Ants',
    server: 'http://' + webServer + '/',
    drawMode : 'map'
  });
});


app.get('/', libAuth.requireLogin, function(req, res){
  
  res.render("game/home.jade", {
    layout:false, 
    'title' : 'Master Of Ants',
    server: 'http://' + webServer + '/',
    drawMode : 'map'
  });
});

/*
app.post('/ants/minimap', function(req, res){
	res.contentType('json');
	var localAnts = Array();
	for (var i = 0; i < global.ants.length; ++i)
	{
		var ant = global.ants[i];
		localAnts.push({'uniqueID' : ant.uniqueID, 'x' : ant.position.x, 'y' : ant.position.y});
	}


	res.end(JSON.stringify (localAnts));

});
*/

