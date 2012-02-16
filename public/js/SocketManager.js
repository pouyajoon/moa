var SocketManager = function(_serverURL){
  this.serverURL = _serverURL;
  this.server = io.connect(this.serverURL);

  this.server.on('connect', function(data){
  	console.log('connected');
  });

  // this.server.on('disconnect', function(data){
  // 	console.log('connected');
  // });
}

SocketManager.prototype.emit = function(name, data) {
  this.server.emit(name, data);
};

SocketManager.prototype.on = function(name, callback) {
  this.server.on(name, callback);
};