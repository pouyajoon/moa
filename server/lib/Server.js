//TODO Separate this logic and try to make it smarter , autoload based on files present etc

var _ = require('underscore');





var Server = function(options, callback){
  process.on('uncaughtException', function (err) {
    //console.log('Caught exception: ', err);
    if (err.code == "EADDRINUSE"){
      return callback(err, null);    
    }
    
  });

  var sys = require("util");
  var express = require('express');
  var MemoryStore = express.session.MemoryStore;
  this.sessionStore = new MemoryStore();
  this.ioActions = [];

  this.app = express.createServer();
  
  this.mongoose = require('mongoose');
  this.db = this.mongoose.connect("mongodb://localhost/moa");
  
  this.options = options;
  this.paths = this.options.paths;
  // require("./models.js").autoload(db);
  // require("./controllers.js").autoload(app);
  // require("./routes.js").draw(app);
  
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

  //console.log('connect on port', this.options.port);
  this.app.listen(this.options.port, function(){
    //console.log("app listen is ok");

    this.webServer = "masterofants.com:" + this.options.port;
    this.app.configure('dev', function(){
      this.webServer = "pouya:" + this.options.port;
    }.bind(this));

    
    this.io = require("socket.io").listen(this.app);
    this.io.set('log level', 1);

    this.app.dynamicHelpers({
      'session' : function(req, res) {
        return req.session;
      },
      'flash' : function(req, res) {
        return req.flash();
      }
    });

    this.ioActions = require('./../classes/game-sockets.js').ioActions;
    return callback(null, this);
  }.bind(this));

  
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