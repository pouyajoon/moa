
// var fs = require ('fs');

// module.exports = function(app){


// 	app.get('/media/:type/:file', function(req, res){
// 		//res.writeHead(200, {'Content-Type': 'text/text'});
// 		var index = fs.readFileSync('../client/' + req.params.type + '/' + req.params.file);
// 		res.end(index);
// 	});

// 	app.get('/media/js/external_libs/:file', function(req, res){
// 		//res.writeHead(200, {'Content-Type': 'text/text'});
// 		var index = fs.readFileSync('../client/js/external_libs/' + req.params.file);
// 		res.end(index);
// 	});

// 	app.get('/media/js/maps/:file', function(req, res){
// 		//res.writeHead(200, {'Content-Type': 'text/text'});
// 		var index = fs.readFileSync('../client/js/maps/' + req.params.file);
// 		res.end(index);
// 	});

// };
