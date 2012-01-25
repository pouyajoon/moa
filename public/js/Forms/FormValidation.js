var FormValidation = function(formSelector){
  this.form = $(formSelector);
  this.rules = {};  
}

FormValidation.prototype.addRule = function(_rule) {
  //console.log('add rule ', _rule);
  var id = _rule.id;  
  if (typeof (this.rules[id]) === "undefined"){
    this.rules[id] = [];
  } 
  this.rules[id].push(_rule);
};

FormValidation.prototype.addError = function(input, message) {
   $(input).after('<label class="error"> ' + message + '</label>');
};

FormValidation.prototype.isValid = function(callback) {
  this.form.find('.error').remove();
  var invalid = false;
  var vhtml5 = this.isHTML5Valid();
  console.log('validate html5 ', vhtml5);
  invalid = !vhtml5 || invalid;
  
  this.isRulesValid(function(_rulesValid){
    console.log('validate rules ', _rulesValid);
    invalid = !_rulesValid || invalid;  
    return callback(!invalid);  
  });
};

FormValidation.prototype.isRulesValid = function(callback) {
  var invalid = false;
  console.log('validate rules ', this.rules);
  var _rulesToCheck = [];
  _.each(this.rules, function(inputRules){
    _.each(inputRules, function(rule){
      _rulesToCheck.push(rule);
    }.bind(this));
  }.bind(this));

  var rc = _rulesToCheck.length;
  if (rc > 0){
    var r = _rulesToCheck[0]; 
    return r.doCheck(this, _rulesToCheck, 0, false, callback);
  }
  return callback(!invalid)
};

FormValidation.prototype.isHTML5InputValid = function(input) {
  var v = input.checkValidity();  
  if (!v){
   this.addError(input, input.validationMessage);
   return false;
  }
  return true;
};

FormValidation.prototype.isHTML5Valid = function() {
  var invalid = false;
  this.form.find('input').each(function(i, input){
    invalid = !this.isHTML5InputValid(input) || invalid;
  }.bind(this));
  return !invalid;
};
FormValidation.prototype.setOnSubmit = function(callback) {
  this.form.bind('submit', callback);
};

var FormRule = function(_id, _check){
  this.id = _id;
  this.check = _check;
  this.input = document.getElementById(this.id);  

}

FormRule.prototype.doCheck = function(formValidator, allRules, currentRulePos, currentInvalid, callback) {
  var rc = allRules.length;
  var value = $(this.input).val();
  this.check(value, function(err, isValid, message){
    var invalid = !isValid;
    if (invalid){
      formValidator.addError(this.input, message);
    }
    console.log(this.id, ' is valid ', isValid, " : ", message);
    if (currentRulePos < rc - 1){
      return allRules[currentRulePos + 1].doCheck(formValidator, allRules, currentRulePos + 1, currentInvalid || invalid, callback);
    } else {
      return callback(!currentInvalid);
    }
  }.bind(this));      
};

