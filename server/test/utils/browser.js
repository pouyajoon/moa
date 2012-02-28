var http = require("http");
var CONFIG = require('./config');

exports.browser = {
	"doHTTPGETRequest" : function(res, _url, _headers, callback){
		res.httpClient = http.createClient(CONFIG.serverConfiguration.options.port, CONFIG.serverConfiguration.host); 
		var request = res.httpClient.request('GET', _url, _headers);
		request.on('response', function (response) {
			//console.log('response');
			res.response = response;
			res.cookies = getCookies(res.response.headers);
			console.log("GET", res.cookies);
			res.response.setEncoding('utf8');
			return callback(null, res);
		});
		request.end();
	}
}

exports.browser.doHTTPPOSTRequest = function(res, _url, _headers, _body, callback){
	res.httpClient = http.createClient(CONFIG.serverConfiguration.options.port, CONFIG.serverConfiguration.host); 
	var bodyData = JSON.stringify(_body);
	_headers['Content-Type'] = 'application/json';
	_headers['Content-Length'] =  Buffer.byteLength(bodyData,'utf8');
	res.request = res.httpClient.request('POST', _url, _headers);	
	res.request.on('response', function (response) {
	 	res.response = response;
		res.cookies = getCookies(res.response.headers);
		console.log("POST", res.cookies);
		res.response.setEncoding('utf8');
		return callback(null, res);
	});
	res.request.write(bodyData);
	res.request.end();
}



function getCookies(_headers){
  var cookies = {};
  _headers["set-cookie"].toString().split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
  });
  return cookies;
}