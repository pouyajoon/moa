var assert = require('assert');
var User = require('../classes/user');
var moaSchema = require('../db/moaSchema');
var should = require('should');
var CONFIG = require('./utils/config');





describe('User', function() {

	CONFIG.setupDatabase();

	describe("Creation", function(){
	  it('create user', function(done) {
	  	createUser(function(err, u){
		    if (err) assert.equal(err, null, "an error exists, this test should not have any error, error is : " + err.err);
		  	u.hasOne({"email" : CONFIG.userInfo.email, "password" : CONFIG.userInfo.password}, done);  
		  });	  
	  });

	  it('create user, already exists', function(done){
	  	createUser(function(err){
	  		createUser(function(err){
	  			assert.notEqual(err, null);
			    assert.equal(err.code, "11000");
			    done();
		  	});
		  });	  
	  });

	  it('subscribe user over socket', function(done){
			subscribeUserTest.repeat(0, done);
	  });


	  function subscribeUserAndAuthenticateUsingUser(user, done, callback){
		  require('./test-socketIO').getSecureSocketFromGame({}, function(err, res){		
		  	CONFIG.checkErr(err);
		  	subscribeUserEmitMessage(res, function(err, res){			  	
		  		CONFIG.checkErr(err);
					require('./test.game').doHTTPPOSTRequest(res, CONFIG.http.authenticateURL, CONFIG.http.options, user, function(err, res){
						CONFIG.checkErr(err);
						res.response.on('data', function(body){
							res.body = body;
							callback(null, res);
						});
					});					
		  	});
		  }, function(err, res){
				CONFIG.checkErr(err);		  	
				res.game.close();
				done();
		  });	  	
	  }

	  it('subscribe user and authenticate with good credentials', function(done){
 			subscribeUserAndAuthenticateUsingUser(CONFIG.userInfo, done, function(err, res){
 				CONFIG.checkErr(err);
				assert.notEqual(res.body.indexOf("Moved Temporarily"), -1, "Moved Temporarily is missing");
				assert.notEqual(res.body.indexOf( CONFIG.serverConfiguration.host  + "/"), -1, "should redirect to /users/login if fails");
				res.socketClient.disconnect();
 			});
	  });

	  it('subscribe user and fail authenticate by providing wrong user name and password', function(done){
 			var user = {"email" : "bad@email.com", "password" : "wrong password"};
 			subscribeUserAndAuthenticateUsingUser(user, done, function(err, res){
 				CONFIG.checkErr(err);
				assert.notEqual(res.body.indexOf("Moved Temporarily"), -1, "Moved Temporarily is missing");
				assert.notEqual(res.body.indexOf("/users/login"), -1, "should redirect to /users/login if fails");
				res.socketClient.disconnect();
 			});
	  });



		it('cant subscribe user, already exists' , function(done){			
			createUser(function(err, u){
				CONFIG.checkErr(err);
			  require('./test-socketIO').getSecureSocketFromGame({}, function(err, res){		
			  	CONFIG.checkErr(err);
					subscribeUserEmitMessage(res, function(err, res){
			  		should.exist(err, "err should not be null as user should already exists");
			  		should.equal(err.code, "11000", "err code is not 11000");
						res.socketClient.disconnect();						
					});
			  }, function(err, res){
					res.game.close();
					done();
			  }); 
			});
	  });  
	});


	describe("Inventory", function(){
	  it('exists after user creation', function(done){
	  	createUser(function(err, u){
	  		CONFIG.checkErr(err);
	  		should.exist(u.inventory, "inventory is null");
				done();
			});
	  });
	  
	  it('has one ant after creation', function(done){
	  	createUser(function(err, u){
	  		CONFIG.checkErr(err);
		  	var antNum = u.inventory.ants.length;
		  	should.equal(antNum, 1, "inventory should have only one ant but has " + antNum);
				done();
			});
	  });
	});
});


function subscribeUserEmitMessage(res, callback){
  	res.socketClient.emit('user-subscribe', {'email': CONFIG.userInfo.email, "password" : CONFIG.userInfo.password}, function(err, u){
  		res.user = u;
  		callback(err, res);
  	});
}

function subscribeUserTest(currentNumber, maxNumber, done, next){
  require('./test-socketIO').getSecureSocketFromGame({}, function(err, res){	
  	CONFIG.checkErr(err);	

  	subscribeUserEmitMessage(res, function(err, res){
  		CONFIG.checkErr(err);
  		should.exist(res.user, "user is null");
  		should.equal(res.user.data.email, CONFIG.userInfo.email, "email of the new user do not equal the config user");
			res.socketClient.disconnect();  		
  	});
  }, function(err, res){
  	CONFIG.checkErr(err);
		res.game.close();
		CONFIG.repeat(currentNumber++, maxNumber, done, next);
  }); 	
}

function createUser(callback){
  	new User(CONFIG.userInfo.email, CONFIG.userInfo.password, function(err, u){
  		callback(err, u);
  	});
}
