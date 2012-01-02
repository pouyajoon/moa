var SocketManager = function(_serverURL){
  this.serverURL = _serverURL;
  this.server = io.connect(this.serverURL);
}

SocketManager.prototype.emit = function(name, data) {
  this.server.emit(name, data);
};

SocketManager.prototype.on = function(name, callback) {
  this.server.on(name, callback);
};