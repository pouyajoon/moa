var io_ssetaction = {"name" : "ssetaction", "doAction" : function(req){
    var z = global.worldZones.loadZone(req.zoneid);
    var floatCamera = camera.createFloatCamera(req.camera);
    var p = {'x' : parseFloat(req.x), 'y' : parseFloat(req.y)};
    var newPos = libWorldTools.transformToRealPosition(p, floatCamera);
    console.log(req.zoneid);
    z.actionNodes.push(new lib_actionNode.ActionNode(req.action, newPos))
  }
};

var io_createQueen = {"name" : "createQueen", "doAction" : function(_creationInfo){
    console.log('queen creation on ' + _creationInfo.zoneID, ", position : ", _creationInfo.position);
    var z = global.moaGame.worldZones.loadZone(_creationInfo.zoneID);
    var q = new lib_queen.Queen("first-Queen", new Position(2000, 2000));
    z.ants.push(q);
  }
};  

var io_getzone = {"name" : "getzone", "doAction" : function(zoneID){
  //console.log('get zone : ', zoneID); 
    global.moaGame.worldZones.getZone(zoneID, function(err, zone){          
      this.zone = zone;
      this.interval  = setInterval(function () { 
        //console.log('emit zone : ', this.zone.data.id);       
        this.emit('zone', this.zone); 
      }.bind(this), 200);
    }.bind(this));      
    //console.log("send zone : ", zoneID);
  }
};

var io_stopzone = {"name" : "stopzone", "doAction" : function(zone_id){
    this.get('sendingZones', function (err, z) {
      //console.log('stop sending : ', this.interval);
      clearInterval(this.interval);
    }.bind(this));
  }
};  

var io_disconnect = {"name" : "disconnect", "doAction" : function () {
    try {
      clearInterval(this.interval);
      console.log('client left');
    } catch (e){
      console.log(e);
    }
  }
};

var io_error = {"name" : "error", "doAction" : function (reason) {
    console.error('Unable to connect Socket.IO', reason);
  }
};


exports.ioActions = [io_error, io_ssetaction, io_createQueen, io_getzone, io_stopzone, io_disconnect];