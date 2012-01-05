var mongoose = require('mongoose');

var Schema = mongoose.Schema;

exports.ZoneSchema = new Schema({
  "id" : {"type": String, "index": true},
  "x" : String,
  "y" : String
});



// function doMongoStuff(){
//   //var moaSchema = require('./../mongo/moaSchema.js');
//   var mongoose = require("mongoose");
//   mongoose.connect('mongodb://localhost/moa');   
//   var ZoneDB = mongoose.model('ZoneDB', moaSchema.ZoneSchema);
//   var z1  = new ZoneDB();
//   z1.save(function(err){
//     if (err) {throw err;}
//     console.log('element saved', z1);
//   });   
//   mongoose.disconnect();
// }



// function doMongoStuff(){
//   //var moaSchema = require('./mongo/moaSchema.js');
//   var mongoose = require("mongoose");
//   mongoose.connect('mongodb://localhost/moa');   
//   var ZoneDB = mongoose.model('ZoneDB', exports.ZoneSchema);
//   var z1  = new ZoneDB();
//   z1.name = "a";
//   z1.save(function(err){
//     if (err) {throw err;}
//     console.log('element saved', z1);
//   });
//   z1.name = "n";
//   z1.save(function(err){
//     if (err) {throw err;}
//     console.log('element saved', z1);
//   });  
     
//   mongoose.disconnect();
// }

//doMongoStuff();


// exports.save = function(model, id, elements){
//   model.update({"_id": z._id}, elements, null, function(err){
//     if (err) {throw err;}
//     console.log('element updated : id : ', id, ', ', elements);
//   });
// }


// exports.set = function(model, id, elements){
//   model.findOne({"id" : id}, function(err, z){
//     if (err) { throw err;}
//     if (z == null) {
//       console.log('element not found in db : id : ' , id, elements);
//       var e = new model();
//       for (eKey in elements){
//         //console.log(eKey);
//         e[eKey] = elements[eKey];
//       }
//       console.log('want to save element', e);
//       e.save(function(err){
//         if (err) {throw err;}
//         console.log('element saved', e);
//       });  
//     } else {      
//       console.log("element found : ", z);  
//       model.update({"_id": z._id}, elements, null, function(err){
//         if (err) {throw err;}
//         console.log('element updated : id : ', id, ', ', elements);
//       });
//     }     
//   });  
// }


// exports.db = function(){

//   mongoose.connect('mongodb://localhost/moa');
//   var ZoneDB = mongoose.model('ZoneDB', ZoneSchema);
//   //mongoose.model('ZoneDB');

//   zID = "100_108"
//   var z2 = new ZoneDB();
//   z2.id = zID;
//   z2.x = "100";
//   z2.y = "160";

//   ZoneDB.findOne({"id" : zID}, function(err, z){
//     if (err) { throw err;}
//     if (z == null) {
//       console.log('zone not found in db');
//       z2.save(function(err){
//         if (err) {throw err;}
//         console.log('zone saved', z2);
//       }); 
//     } else {      
//       console.log("zone found : ", z);  
//       ZoneDB.update({"_id": z._id}, z2, null, function(err){
//         if (err) {throw err;}
//         console.log('zone updated', z2);
//       });
//     }     
//   });
//   //console.log('findOne: ', f);



// }

// //exports.db();