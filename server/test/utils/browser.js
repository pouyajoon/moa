var http = require("http");
var CONFIG = require('./config');

exports.browser = {
  "doHTTPGETRequest" : function(res, _url, _headers, callback){
    if (res.httpClient == null) return callback("HTTP Client is missing in res");
    setCookies(res, _headers);
    var request = res.httpClient.request('GET', _url, _headers);
    request.on('response', function (response) {
      res.response = response;
      res.cookies = getCookies(res.response.headers);
      res.response.setEncoding('utf8');
      return callback(null, res);
    });
    request.end();
  }
}

exports.browser.doHTTPPOSTRequest = function(res, _url, _headers, _body, callback){
  if (res.httpClient == null) return callback("HTTP Client is missing in res");
  var bodyData = JSON.stringify(_body);
  _headers['Content-Type'] = 'application/json';
  _headers['Content-Length'] =  Buffer.byteLength(bodyData,'utf8');
  setCookies(res, _headers);
  //console.log("post headers", _headers);
  res.request = res.httpClient.request('POST', _url, _headers);
  res.request.on('response', function (response) {
    res.response = response;
    res.cookies = getCookies(res.response.headers);
    res.response.setEncoding('utf8');
    return callback(null, res);
  });
  res.request.write(bodyData);
  res.request.end();
}

exports.browser.createHTTPServer = function(res, callback){
  res.httpClient = http.createClient(CONFIG.serverConfiguration.options.port, CONFIG.serverConfiguration.host);
  callback(null, res);
}

function setCookies(res, _headers){

  if (res.cookies && res.cookies["session.id"]){
    _headers['Cookie'] = 'session.id=' + res.cookies["session.id"];
  }
}

function getCookies(_headers){
  var cookies = {};
  _headers["set-cookie"].toString().split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
  });
  return cookies;
}