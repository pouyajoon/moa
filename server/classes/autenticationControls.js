
var libAuth = require('./autentication');
var qs = require('querystring');
var crypto = require('crypto');
var User = require('./user');
var moaSchema = require('./../db/moaSchema');
var UserModel = moaSchema.UserModel;

module.exports = function(server){

  var pageLogin = {"path" : "/users/login", "view" : "users/login.jade", "renderOptions" : {"drawMode" : 'map'}};
  server.paths.push(pageLogin);

  server.app.get('/users/logout', libAuth.requireLogin, function(req, res) {
  	req.session.user = null;
  	res.redirect('/');	
  });

  var parseCookie = require('connect').utils.parseCookie;


  function checkSession(data, sID, callback){
//    console.log("check session", sID, typeof sID);
    server.sessionStore.get(sID, function (err, session) {
      if (err) callback(err)
        //console.log(session);
      if (err || !session) {
        
        //console.log("err:", err, "session: ", session, " : sID : ", sID);
        // if we cannot grab a session, turn down the connection
        return callback('Error : >' + data , false);
      } else {
        //console.log("session accepted");
        // save the session data and accept the connection
        data.session = session;
        return callback(null, true);
      }
    });
  }

  // function checkSession(data, server, sID, callback){
  //   server.getSession(sID, function(err, session){
  //     //console.log(err);
  //     if (err) return callback(err, false);
  //     data.session = session;
  //     return callback(null, true);
  //   });
  // }

  //console.log("setup authorization");
  server.io.set('authorization', function (data, accept) {
    //return accept(null, true);
    //console.log("authorization : ", data);
    if (data.headers.cookie) {
      //console.log("authorization headers : ", data.headers.cookie);
      data.cookie = parseCookie(data.headers.cookie);
      data.sessionID = data.cookie['session.id'];
      return checkSession(data, data.sessionID, accept);
    } else {
      //console.info("no cookie");
      
      if (data.query["session.id"] !== "undefined"){
        var sID = decodeURIComponent(data.query["session.id"])
        //console.error("data", data);
        //return accept(null, true);
        //console.log(sID);
        data.sessionID = sID;
        //console.log("SID ON HANDSHAKE", sID);
        return checkSession(data, sID, accept);
      } else {
        //console.error("no cookie, n/a");
        return accept('No cookie transmitted.', false);   
      }       
    }
  });

  server.app.post('/users/authenticate', function(req, res){
    var u = new UserModel();
    u.model = UserModel;
    u.hasOne({"email" : req.body.email, "password" : req.body.password}, function(err, exists, user){
      //console.log("ERREUR", err);
      if (exists) {
        //console.log("USER AUTH DONE", user.__proto__);
        //req.session.bisou = "yes";
        req.session.user = user;
        //req.session.user.bisou = "yes";
        //console.log(req.session.user);
        res.redirect('/');
      } else { 
        req.flash('warn', 'Wrong username or password');     
        res.redirect('/users/login');
      }    
    })
  });

};

