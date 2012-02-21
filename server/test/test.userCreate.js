var assert = require('assert');
var User = require('../classes/user');
var moaSchema = require('../db/moaSchema');
var should = require('should');
var CONFIG = require('./utils/config');

describe('User', function() {

	beforeEach(function(){
		this.db = require('./utils/db').loadDB();
		require('./utils/db').clearDB();
	});

	afterEach(function(){
		require('./utils/db').closeDB(this.db);
	});

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
	 	  require('./test-socketIO').getSecureSocketFromGame(function(_server, _game, _socketClient){		
	 	  	should.exist(_game, "game is null");

	 	  	_socketClient.on('connect', function(){
	 	  		console.log('socket client connected');
	 	  	});

	 	  	_socketClient.emit('user-subscribe', {'email': CONFIG.userInfo.email, "password" : CONFIG.userInfo.password}, function(err, u){
	 	  		CONFIG.checkErr(err);
	 	  		should.exist(u, "user is null");
					_socketClient.disconnect();
	 	  	});

	 	  	_socketClient.on('disconnect', function(){
	 	  		console.log('socket client disconnected');
					_server.close();
					done();	 	  		
	 	  	});
			}); 
	  });

		it('cant subscribe user, already exists' , function(done){			
	 	  require('./test-socketIO').getSecureSocketFromGame(function(_server, _game, _socketClient){		
	 	  	should.exist(_server, "server is null");
	 	  	should.exist(_game, "game is null");

	 	  	_socketClient.on('connect', function(){
	 	  		console.log('socket client connected');
	 	  	});

	 	  	_socketClient.emit('user-subscribe', {'email': CONFIG.userInfo.email, "password" : CONFIG.userInfo.password}, function(err, u){
	 	  		CONFIG.checkErr(err);
	 	  		should.exist(u, "user is null");
					_socketClient.disconnect();
	 	  	});

	 	  	_socketClient.on('disconnect', function(){
	 	  		console.log('socket client disconnect');
					_server.close();
					done();	 	  		
	 	  	});
			}); 
	  });  



	});
	describe("Inventory", function(){
	  it('exists after ant creation', function(done){
	  	createUser(function(err, u){
	  		assert.notEqual(u.inventory, null);
				done();
			});
	  });
	  
	  it('has one ant after creation', function(done){
	  	createUser(function(err, u){
		  	assert.notEqual(u.inventory, null);
		  	var antNum = u.inventory.ants.length;
		  	assert.equal(antNum, 1, "inventory should have only one ant but has " + antNum);
				done();
			});
	  });
	});

});

function createUser(callback){
  	new User(CONFIG.userInfo.email, CONFIG.userInfo.password, function(err, u){
  		callback(err, u);
  	});
}
