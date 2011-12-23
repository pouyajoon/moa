var SocketManager = function(_serverURL, callback){
  this.serverURL = _serverURL;
  this.server = io.connect(this.serverURL);
  callback(this.server);
}

SocketManager.prototype.emit = function(name, data) {
  this.server.emit(name, data);
};

SocketManager.prototype.on = function(name, callback) {
  thie.server.on(name, callback);
};