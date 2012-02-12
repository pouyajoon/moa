
var libAuth = require('./autentication');
var qs = require('querystring');
var crypto = require('crypto');
var User = require('./user');

module.exports = function(server){

  var pageLogin = {"path" : "/users/login", "view" : "users/login.jade", "renderOptions" : {"drawMode" : 'map'}};
  server.paths.push(pageLogin);

  server.app.get('/users/logout', libAuth.requireLogin, function(req, res) {
  	req.session.user = null;
  	res.redirect('/');	
  });

  var parseCookie = require('connect').utils.parseCookie;
  server.io.set('authorization', function (data, accept) {
    if (data.query.noauth == "true"){
      return accept(null, true);
    }
    console.log("authorization : ", data);
    if (data.headers.cookie) {
        //console.log("authorization headers : ", data.headers.cookie);
        data.cookie = parseCookie(data.headers.cookie);
        data.sessionID = data.cookie['session.id'];
        server.sessionStore.get(data.sessionID, function (err, session) {
            if (err || !session) {
                console.log("err: %s, session: %s", err, session);
                // if we cannot grab a session, turn down the connection
                return accept('Error : ' + data , false);
            } else {
                // save the session data and accept the connection
                data.session = session;
                return accept(null, true);
            }
        });      
    } else {
       return accept('No cookie transmitted.', false);
    }
  });

  function subscribeUser(_user, callback){
    console.log('subscribe user', _user);
    var u = new User(_user.email, _user.password);
    u.saveToDB(function(err){
      if (err){
        console.log("error while subscribeUser :", err);
        callback(err);      
      }
      callback(null);        
    });
  }

  var io_subscribeUser = {"name" : "user-subscribe", "doAction" : function (_user, callback) {
      try {
        console.log("user subscribe socket received");
        subscribeUser(_user, callback);     
      } catch (e){
        console.log(e);
      }
    }
  };

  var io_userExists = {"name" : "user-exists", "doAction" : function (_email, callback) {
      console.log('get user exists ', _email);    
      var u = new User(_email);
      u.exists(function(err, e){
        if (err) {throw err;}
        callback(null, e)
      });
    }
  };
  server.ioActions.push(io_subscribeUser);
  server.ioActions.push(io_userExists);

  server.app.post('/users/authenticate', function(req, res){
  	var u = new User(req.body.email , req.body.password);
  	u.existsWithPassword(function(err, exists){
  		console.log("user authentication: err: %s, userexists : %s, body: ", err, exists, req.body);
  		if (exists) {
  			req.session.user = u;
  			res.redirect('/');
  		} else {
  			req.flash('warn', 'Wrong username or password');
  			res.redirect('/users/login');
  		}
  	});
  });

};

