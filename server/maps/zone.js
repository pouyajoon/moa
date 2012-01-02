var Zone = function(zID, _model, _dbItem) {
  this.dbItem = _dbItem;

  if (this.dbItem == null){
    this.dbItem = new _model();
    this.dbItem.id = zID;
    console.log('creating zone ' + this.dbItem.id);
  }
  else
  {
    //console.log('creating zone from db ' + this.dbItem.id);    
  }

  this.saveToDB();
  this.ants = new Array();
  this.actionNodes = new Array();
  
}

Zone.prototype.saveToDB = function(){
  this.dbItem.save(function(err){
    if (err) {throw err;} 
    //console.log("save after creating ", this.dbItem.id)
  }.bind(this));
}

module.exports = Zone;
