
var libAuth = require('./autentication');
var qs = require('querystring');
var crypto = require('crypto');
var User = require('./user');
var moaSchema = require('../db/moaSchema');

module.exports = function(server){

  var pageLogin = {"path" : "/users/login", "view" : "users/login.jade", "renderOptions" : {"drawMode" : 'map'}};
  server.paths.push(pageLogin);

  server.app.get('/users/logout', libAuth.requireLogin, function(req, res) {
  	req.session.user = null;
  	res.redirect('/');	
  });

  var parseCookie = require('connect').utils.parseCookie;

  function checkSession(data, server, sID, callback){
    //console.log("check session", sID, typeof sID);
    server.sessionStore.get(sID, function (err, session) {
      if (err) callback(err, false);
      if (err || !session) {
        //console.log("err:", err, "session: ", session, " : sID : ", sID);
        // if we cannot grab a session, turn down the connection
        return callback('Error : ' + data , false);
      } else {
        //console.log("session accepted");
        // save the session data and accept the connection
        data.session = session;
        return callback(null, true);
      }
    });
  }

  //console.log("setup authorization");
  server.io.set('authorization', function (data, accept) {
    //return accept(null, true);
    //console.log("authorization : ", data);
    if (data.headers.cookie) {
      //console.log("authorization headers : ", data.headers.cookie);
      data.cookie = parseCookie(data.headers.cookie);
      data.sessionID = data.cookie['session.id'];
      checkSession(data, server, data.sessionID, accept);
    } else {
      //console.info("no cookie");
      if (data.query["session.id"] !== "undefined"){
        //console.error("sessions id defined");
        return checkSession(data, server, data.query["session.id"], accept);
      } else {
        //console.error("no cookie, n/a");
        return accept('No cookie transmitted.', false);   
      }       
    }
  });


  var dbItem = require('./../db/DataBaseItem');

  server.app.post('/users/authenticate', function(req, res){
    //console.log(req.body);
    var users = new dbItem(moaSchema.UserModel);
    users.hasOne({"email" : req.body.email, "password" : req.body.password}, function(err, exists, user){
      if (exists) {
        req.session.user = user;
        res.redirect('/');
      } else { 
        req.flash('warn', 'Wrong username or password');     
        res.redirect('/users/login');
      }    
    })
  });

};

