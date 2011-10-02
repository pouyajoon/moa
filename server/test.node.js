
////var p = require ('prototype');

//setTimeout(function(){

//	var artest = Array();
////		artest.inject(1, "a");
////	artest.insert('hop', 1);// = 1;
////	artest.prototype['top'] = 2;	
//	artest.push('f');
//	artest["g"] = 1;
//	artest["dg"] = 1;
//	
//	for (var i in artest){
//		console.log(i + " : " + artest[i]);
//	}
////	artest.insert(9, 'ggg');
//	//console.log(a);
//	//console.log("number of zones : " + worldZones.allZones.length);
//	console.log(artest.length);
////	console.log(artest.entries());
//	console.log(artest);	
//	console.log(artest['g']);
////	artest.each(function(i, e){console.log(i);});
//}, 0);



setTimeout(function(){



	var Person = {
		greet: function () {
		  console.log("Hello world, my name is " + this.name);
		}
	};
	var frank = Object.create(Person);
	
	
	
	var Man = Object.create(Person, {});
	
	var m = Object.create(Man);
	m.name = "jo";
	m.greet();
	
	frank.name = "Frank Dijon";
	frank.greet();

//var Animal = {
//  eyes: 2,
//  legs: 4,
//  name: "Animal",
//  toString: function () {
//    return this.name + " with " +
//      this.eyes + " eyes and " +
//      this.legs + " legs.";
//  }
//}
//var Dog = Object.spawn(Animal, {
//  name: "Dog"
//});
//var Insect = Object.spawn(Animal, {
//  name: "Insect",
//  legs: 6
//});
//var fred = Object.spawn(Dog);
//var pete = Object.spawn(Insect);
//console.log(fred.toString());
//console.log(pete.toString());

}, 0);

