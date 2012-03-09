var AntInfoBox = function(socketManager, antMessage){
	this.remove();
	this.antMessage = antMessage;
	var socket = socketManager.socket;
	var o = [];
	o.push('<div class="antInfoBox"><ul>');
		this.pushAttribute(o, "User", antMessage.user.email);
		this.pushAttribute(o, "Action", antMessage.ant.action);
		_.each(antMessage.actions, function(action){
			switch(action){
				case "sendToInventory" :
					this.pushAction(o, "Send To Inventory", action);
				break;
				case "move" :
				break;
				default:
			}
		}.bind(this));
	o.push('</ul></div>');
	$('body').append(o.join(''));

	_.each(antMessage.actions, function(action){
		switch(action){
			case "sendToInventory" :
				$('#' + this.getActionID(action)).click(function(event){
					//console.log('click');
					socket.emit("sendToInventory", this.antMessage.ant._id);
				}.bind(this));
			break;
			case "move" :
			break;
			default:
		}
	}.bind(this));
};

AntInfoBox.prototype.getActionID = function(action) {
	return this.antMessage.ant._id + '-' + action;
};

AntInfoBox.prototype.remove = function() {
	$('.antInfoBox').remove();
};

AntInfoBox.prototype.pushAttribute = function(output, name, value) {
	output.push('<li>', name, ":", value,'</li>');
};

AntInfoBox.prototype.pushAction = function(output, name, action) {
	output.push('<li><a href="#" id="',this.getActionID(action), '">', name,'</a></li>');
};