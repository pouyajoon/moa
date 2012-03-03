var SocketManager = function(_serverURL){
  this.serverURL = _serverURL;
  this.socket = io.connect(this.serverURL);

  this.socket.on('connect', function(data){
  	console.log('connected');
  });

  this.socket.on('disconnect', function(data){
  	console.log('disconnected');
  });
}

SocketManager.prototype.emit = function(name, data) {
  console.log("emit ", name, data);
  this.socket.emit(name, data);
};

SocketManager.prototype.on = function(name, callback) {
  this.socket.on(name, callback);
};

SocketManager.prototype.unbind = function(name) {
  this.socket.removeAllListeners(name);
};

