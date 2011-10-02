var users = {
	'pouya' : {'login' : 'pouya', 'password' : 'bisou', 'email' : 'pouyajoon@gmail.com'},
	'jannou' : {'login' : 'jannou', 'password' : 'bisou', 'email' : 'jeannedelcourt@gmail.com'},	
	'lilthie' : {'login' : 'lilthie', 'password' : 'bisou', 'email' : 'lilthie@gmail.com'},
	'aurel' : {'login' : 'aurel', 'password' : 'aurel', 'email' : 'aurel.spam@gmail.com'}		
};

exports.userExists = function (username, password, callback) {
	var user = users[username];
	if (!user) {
		callback(null);
	} else {
		if (user.password == password) {
				callback(user);
		} else {
			callback(null);
		}
	}	
}
