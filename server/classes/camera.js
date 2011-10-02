//// properties are directly passed to `create` method
//exports.Camera = Class.create({
//  initialize: function() {
//    this.worldZoom = 1;
//    this.translateX = 0;
//    this.translateY = 0;
//  },
//  initialize: function(_worldZoom, _translateX, _translateY) {
//    this.worldZoom = _worldZoom;
//    this.translateX = _translateX;
//    this.translateY = _translateY;
//  }   
//});

// parse the float in the user camera (from POST data) and create the new float camera with camera data
exports.createFloatCamera = function (userCamera){
	var floatCamera = {
	'traX' : parseFloat(userCamera.translateX),
	'traY' : parseFloat(userCamera.translateY),
	'ScreenWidth' : parseFloat(userCamera.ScreenSize.w),
	'ScreenHeight' : parseFloat(userCamera.ScreenSize.h),
	'worldInitX' : parseFloat(userCamera.worldInitX),
	'worldInitY' : parseFloat(userCamera.worldInitY),		
	'worldZoomLevel' : parseFloat(userCamera.worldZoomLevel),			
	'maxX' : 0,
	'maxY' : 0
	};
	floatCamera.maxX = floatCamera.ScreenWidth + floatCamera.traX;
	floatCamera.maxY = floatCamera.ScreenHeight + floatCamera.traY;	
	return floatCamera;	
}
