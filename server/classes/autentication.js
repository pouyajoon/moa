
//exports.

exports.requireLogin = function(req, res, next) {
  // You would fetch your user from the db
  if (req.session.user) {
  	next();
  } else {
  	res.redirect('/users/login');
  }
}

//function requireLogin(req, res, next) {
//  // You would fetch your user from the db
//  if (req.session.user) {
//  	next();
//  } else {
//  	res.redirect('/users/login');
//  }
//}
