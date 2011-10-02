var libWorldTools = require('./worldTools');


//when it's action nodes time
function playActionNodes(currentZone){

	var deleteActionNodes = Array();

	for (var i = 0; i < currentZone.actionNodes.length; ++i){
		var actionNode = currentZone.actionNodes[i];
		actionNode.play();
		if (actionNode.shouldBeDeleted()){
			deleteActionNodes.push(i);
		}
	}

	for (var i = 0; i < deleteActionNodes.length; ++i){
		currentZone.actionNodes.splice(deleteActionNodes[i], 1);
	}		
}


// when it's ants time
function playAnts(currentZone) {
	var deleteAnts = Array();
	
	for (var i = 0; i < currentZone.ants.length; ++i){
		var ant = currentZone.ants[i];
		if (ant == null) continue;
		ant.play(currentZone);
		if (ant.shouldBeDeleted()){
			deleteAnts.push(i);
		}		
	}
	
	for (var i = 0; i < deleteAnts.length; ++i){
		currentZone.ants.splice(deleteAnts[i], 1);
	}
}


exports.launchGame = function (){

	setInterval(function(){
		var shouldDelete = Array();
		var shouldDeleteNode = Array();
	
		var startTime = (new Date()).getTime();//new Date(milliseconds);

		for (var zID in global.worldZones.allZones){
			var z = worldZones.allZones[zID];
			playActionNodes(z);
			playAnts(z);


		}		
		// delete the useless nodes

	
	
		var now = (new Date()).getTime();
		var processDuration = now - startTime;
	//	console.log("Game processing time : " + processDuration.toString() + 'ms for ' +  global.ants.length + " ants");
	
	
	}, global.gameTime);
}

