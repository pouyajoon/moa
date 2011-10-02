//$(function(){
////	alert('in');

//});

var socket = io.connect('http://pouya:8080/');


  socket.on('connect', function (data) {
  	console.log("hi!");
//		$('#main').append(data);
  });
  
  socket.on('zones', function (data) {
  	console.log("zones : " + data.zones);
//		$('#main').append(data);
  });  

//var zone1 = io.connect('http://pouya:8080/zone/3');

//  zone1.on('connect', function (data) {
//		$('#main').append(data);
//   //console.log('connected')
//    //chat.emit('hi!');
//  });


//var socket = io.connect('http://pouya:8080/');
//socket.on('news', function (data) {
////	alert(data);
//	console.log(data);
////	socket.emit('my other event', { my: 'data' });
//});

//socket.on('text', function (data) {
////	console.log('')
//	$('#main').append(data);
////	alert(data);
//	console.log(data);
////  socket.emit('my other event', { my: 'data' });
//});
