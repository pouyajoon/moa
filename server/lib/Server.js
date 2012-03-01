//TODO Separate this logic and try to make it smarter , autoload based on files present etc

var _ = require('underscore');


  process.on('uncaughtException', function (err) {
    console.log('uncaughtException : ', err);  
    return callback(err, null); 
  });

var Server = function(options, callback){

  var express = require('express');
  var RedisStore = require('connect-redis')(express);
  this.sessionStore = new RedisStore();
  this.ioActions = [];

  this.app = express.createServer();
  
  this.options = options;
  this.paths = this.options.paths;
  
  this.app.configure(function(callback){
    this.app.set('view engine', 'jade');
    this.app.set('views', __dirname + '/../views');      
    this.app.use(express.methodOverride());
    this.app.use(express.bodyParser());
    this.app.use(express.cookieParser());
    this.app.use(express.static(__dirname + '/../../public'));
    this.app.use(express.session({"secret":"grand mere", "key" : "session.id", 'store' : this.sessionStore}));
    this.app.use(this.app.router);
    this.app.use(express.errorHandler({ dump: true, stack: true }));
  }.bind(this));

  this.app.listen(this.options.port, function(err){
    this.webServer = "masterofants.com:" + this.options.port;
    this.app.configure('dev', function(){
      this.webServer = "pouya:" + this.options.port;
    }.bind(this));

    this.io = require("socket.io").listen(this.app, { log: false });
    this.io.set('log level', 3);
    this.io.set('transports', ["websocket"]);
    this.app.dynamicHelpers({
      'session' : function(req, res) {
        return req.session;
      },
      'flash' : function(req, res) {
        return req.flash();
      }
    });

    this.ioActions = require('./../classes/game-sockets.js').ioActions;
    require ('./../classes/autenticationControls')(this);
    this.setRoutes();
    //console.log('server initialized');
    return callback(null, this);
  }.bind(this));
};


// Server.prototype.getSession = function(sID, callback) {
//   this.sessionStore.get(sID, function (err, session) {
//     if (err) return callback(err, null);
//     console.log(session, err);
//     if (_.isUndefined(session)) return callback(new Error("session is null"), null);
//     return callback(null, session);
//   });
// };


Server.prototype.close = function() {  
  this.app.close();
};

Server.prototype.setRoutes = function (){
  _.each(this.paths, function(p){
    
    var renderOptions = {
      "layout" : false,
      "server" : 'http://' + this.webServer + '/',
      "title" : p.title || "Master Of Ants"
    }
    if (typeof p.renderOptions !== "undefined"){
      for (var option in p.renderOptions){
          renderOptions[option] = p.renderOptions[option];
      };      
    }
    if (typeof p.login !== "undefined"){
      this.app.get(p.path, p.login, function(req, res){
        res.render(p.view, renderOptions);
      });      
    } else {
      this.app.get(p.path, function(req, res){
        res.render(p.view, renderOptions);
      });      
    }
  }.bind(this));
}

module.exports = Server;