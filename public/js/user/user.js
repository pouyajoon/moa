$(function(){
  var socket = io.connect(MOA_SERVER);

  socket.on('connect', function(data){
    console.log('connected to socket io ', data);
  });

  var formValidator = new FormValidation("#user-subscribe");

  var ruleEmailExists = new FormRule("nemail", function(value, callback){
    var user = new User(value);
    user.exists(socket, function(err, exists){
      console.log('check user : ', value, 'answer', exists);
      var message = "No Error.";
      if (exists){
        message = "The email already exists, please choose a new email.";
      }
      return callback(err, !exists, message);
    });
  });

  var ruleCheckPassword = new FormRule('ncpassword', function(value, callback){
    if ($('#npassword').val() === $('#ncpassword').val()){
      return callback(null, true, "No Error.");
    }
    return callback(null, false, "Password and confirmation password don't match.");
  });

  formValidator.addRule(ruleCheckPassword);
  formValidator.addRule(ruleEmailExists);

  formValidator.setOnSubmit(function(e){
    e.preventDefault();
    $('#warn').html('').hide();
    $('#info').html('').hide();
    this.isValid(function(v){
      console.log('global validity :', v);
      if (v){
        var user = new User($('#nemail').val(), hex_md5($('#npassword').val()));
        user.subscribe(socket);
      }
    });
  }.bind(formValidator));

  $('#user-login').submit(function(){
    var pwd = hex_md5($('#password').val());
    $('#password').val(pwd);
    $(this)[0].submit();
  });

});

var User = function(email, password){
  this.email = email;
  this.password = password;
};


User.prototype.subscribe = function(socket) {
  socket.emit('user-subscribe', this, function(err){
    if (err){
      console.error(err.message);
      $("#warn").append("Impossible to add the user.");
      $("#error").fadeIn(250);
      return;
    }
    $("#info").html('The user has been added, you can now login, your email has been copied into login box.');
    $("#info").fadeIn(250);
    $('#email').val(this.email);
    $('#password').val('');
  }.bind(this));
};



User.prototype.exists = function(socket, callback){
  socket.emit('user-exists', this.email, function(err, exists){
    console.log('get answer', err, exists);
    if (err) {callback(err, false);}
    if (exists){
      //$('#nemail').after('<span class="error"> The email already exists</span>');
      callback(null, true);
    } else {
      callback(null, false);
    }
  }.bind(this));
};
