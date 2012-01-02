//TODO Separate this logic and try to make it smarter , autoload based on files present etc

var _ = require('underscore');

var Setup = function(o){
  var sys = require("sys");
  var express = require('express');

  this.app = express.createServer();
  
  this.mongoose = require('mongoose');
  this.db = this.mongoose.connect("mongodb://localhost/moa");
  
  this.paths = o.paths;
  // require("./models.js").autoload(db);
  // require("./controllers.js").autoload(app);
  // require("./routes.js").draw(app);
  
  this.app.configure(function(){
      this.app.set('view engine', 'jade');
      this.app.set('views', __dirname + '/../views');      
      this.app.use(express.methodOverride());
      this.app.use(express.bodyParser());
      this.app.use(express.cookieParser());
      this.app.use(express.static(__dirname + '/../../public'));
      this.app.use(express.session({secret:"grand mere"}));
      this.app.use(this.app.router);
      this.app.use(express.errorHandler({ dump: true, stack: true }));
  }.bind(this));  
  this.app.listen(o.port || 3000);

  this.webServer = "masterofants.com:" + o.port;
  this.app.configure('dev', function(){
    this.webServer = "localhost:" + o.port;
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
 
 setRoutes(this);

};


var setRoutes = function (_setup){
  _.each(_setup.paths, function(p){
    var renderOptions = {
      "layout" : false,
      "server" : 'http://' + _setup.webServer + '/',
      "title" : p.title || "Master Of Ants"
    }
    if (typeof p.renderOptions !== "undefined"){
      for (var option in p.renderOptions){
          renderOptions[option] = p.renderOptions[option];
      };      
    }
    if (typeof p.login !== "undefined"){
      _setup.app.get(p.path, p.login, function(req, res){
        res.render(p.view, renderOptions);
      });      
    } else {
      _setup.app.get(p.path, function(req, res){
        res.render(p.view, renderOptions);
      });      
    }
  });
}

module.exports = Setup;