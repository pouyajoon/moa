var SocketManager = function(_game, _serverURL){
  this.game = _game;
  this.serverURL = _serverURL;
  this.socket = io.connect(this.serverURL);

  this.socket.on('connect', function(data){
  	console.log('connected');
  });

  this.socket.on('disconnect', function(data){
  	console.log('disconnected');
    this.game.close();
    //this.socket = null;
  }.bind(this));
}

SocketManager.prototype.emit = function(name, data, callback) {
  if (this.socket == null) return;
  console.log("emit ", name, data);
  this.socket.emit(name, data, callback);
};

SocketManager.prototype.on = function(name, callback) {
  if (this.socket == null) return;
  this.socket.on(name, callback);
};

SocketManager.prototype.unbind = function(name) {
  if (this.socket == null) return;
  this.socket.removeAllListeners(name);
};

