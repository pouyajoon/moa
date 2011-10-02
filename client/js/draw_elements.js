function drawImageUsingRotation(ctx, x, y, w, h, d, imgObj)
{

//var r = d * Math.PI / 180;

//	console.log('canvas size :' + ctx.canvas.width + ", " + ctx.canvas.height);
		//ctx.clearRect(0, 0, c.width, c.height);		


//	var cw2 = ctx.canvas.width / 2;
//	var ch2 = ctx.canvas.height / 2;
//	var r = d * Math.PI / 180;

//	ctx.translate(+camera.translateX, +camera.translateY);

//	ctx.translate(camera.translateX, camera.translateY);

//	console.log('canvas size :' + ctx.canvas.width + ", " + ctx.canvas.height);
		//ctx.clearRect(0, 0, c.width, c.height);		
//	ctx.translate(cw2, ch2);
//	ctx.rotate(r);
//	ctx.translate(-cw2, -ch2);


//	ctx.fillRect (h + y, ctx.canvas.width - h * 2 - x, w, h);
//	ctx.drawImage(imgObj, h + y, ctx.canvas.width - h * 2 - x, w, h);	
//ctx.fillCircle()
			ctx.fillRect ( x, y, w, h);					
//	ctx.translate(cw2, ch2);
//	ctx.rotate(-r);
//	ctx.translate(-cw2, -ch2);		

//	ctx.translate(-camera.translateX, -camera.translateY);
}


// redraw all the elements
function redrawChildren(mainScreen)
{
		mainScreen.children().each(function () {
			redrawElement($(this));
		});
}

// draw one ant
function redrawElement(e) {
//			alert(camera.worldZoomLevel);
//			alert(e.attr('id'));
			var w = 50 * camera.worldZoomLevel;
			var h = 44 * camera.worldZoomLevel;
			//console.log(e.position().left);
			var x = (e.position().left + camera.translateX);// * camera.worldZoomLevel;
//			var y = (e.position().top + camera.translateY);// * camera.worldZoomLevel;			
			var y = e.position().top + camera.translateY;
			e.width(w);
			e.height(h);
//			alert(x);
//			console.log("camera.translateX : " + camera.translateX);
//			console.log("left_pos : " + e.position().left + ", new pos : " + x);


			e.css("top", y);//({ top: y, left: x})
			e.css("left", x);

//			e.position().left = x;
//			e.position().top = y;
}
