


var test = function(callback){

	process.on('uncaughtException', function (err) {
		return callback(err)
  	console.log('test Caught exception: ' + err);
	});

    var express = require('express');
    var app = express.createServer(function(err){
    	console.log("err", err);
    });
    //app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
    app.listen(3000, function(err){
    	console.log('listen: ', err);
    });
    //return callback(null);
}


try{


	new test(function(err){
		console.log('test created ', err);	
	});
	

}
catch(err){
	console.log("catched: ", err);
}

// process.on('uncaughtException', function (err) {
//   console.log('Caught exception: ' + err);
// });