
// check if the user is connected, if not redirect to the user login page
exports.requireLogin = function(req, res, next) {
  // You would fetch your user from the db
  if (req.session.userID) {
    next();
  } else {
    res.redirect('/users/login');
  }
};