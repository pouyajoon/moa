var WorldZones = require('../../maps/zones');
var Zone = require('../../maps/zone');
var assert = require('assert');
var should = require('should');

var CONFIG = require('./config');
var common = require('./common');

exports.zones = {
  "createZoneRueTaine" : function(res, callback){
    new WorldZones(function(err, _worldZone){
      assert.equal(err, null);
      should.exist(_worldZone, "worldZones is null");
      res.worldZone = _worldZone;
      _worldZone.createZone(CONFIG.zoneTaine.id, function(err, z){
        assert.equal(err, null);
        assert.equal(z.id, CONFIG.zoneTaine.id, 'zone id is wrong : ' + z);
        res.zone = z;
        return callback(err, res);
      });
    });
  }
}

exports.zones.getZoneFromSocket  = function(res, callback){
  common.getSecureSocketFromGame(res, function(err, res){
    res.socket.emit('getZone', CONFIG.zoneTaine.id);
    res.socket.on('zone', function(zone){
      res.zone = zone;
      return callback(err, res);
    });
  });
}

