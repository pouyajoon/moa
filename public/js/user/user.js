$(function(){

  var socket = io.connect(MOA_SERVER);

  $("#ncpassword").blur(null, function(){
    clearNInput();
    validatePassword('#npassword', '#ncpassword');
  });

  $('#nemail').blur(null, function(){
    clearNInput();
    if (validateEmail(this)){
      userExists(socket, $(this).val(), function(err, exists){
        if (!exists){
          $(this).addClass('ninput-ok');
        } else {
          $(this).removeClass('ninput-ok');
        }
      }.bind(this));
    }
  });

  $('#subscribe-user').click(function(){
    clearNInput();
    var ee = validateEmail('#nemail');
    var pe = validatePassword('#npassword', '#ncpassword');
    if (ee && pe){
      var user = {'email' : $('#nemail').val(), 'password' : hex_md5($('#npassword').val())};
      console.log('ok', user);
      socket.emit('subscribe-user', user, function(err){
        if (err){
          console.error(err);
          $(this).after('<span class="error"> ' + err.message + '</span>');    
        }
      }.bind(this));
    } else {
      console.log('ko');
    }
  });
})



function clearNInput(){
  $(".error").hide();
  $('.ninput').removeClass('ninput-ok');
}

function userExists(socket, _email, callback){
  socket.emit('user-exists', _email, function(err, exists){
    console.log('get answer', err, exists);
    if (err) {callback(err, false);}
    if (exists){
      $('#nemail').after('<span class="error"> The email already exists</span>');
      callback(null, true)
    } else {
      callback(null, false);
    }
  }.bind(this));     
}

function validatePassword(s1, s2){
  if ($(s1).val() !== $(s2).val()){
    $(s2).after('<span class="error"> Confirmation passowrd is different of password.</span>');
    return false;
  }
  if ($(s1).val() == ''){
    $(s1).after('<span class="error"> Please enter a password.</span>');
    return false;
  }
  return true;
}

function validateEmail(input){
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

  var value = $(input).val();
  if(value == '') {
    $(input).after('<span class="error"> Please enter your email address.</span>');
    return false;
  }
  else if(!emailReg.test(value)) {
    $(input).after('<span class="error"> Please enter a valid email address.</span>');
    return false;
  }
  return true;
}