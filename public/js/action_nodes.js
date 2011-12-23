var actionNodesItems = [
{'name' : 'none', 'color' : 'grey'},
{'name' : 'follow', 'color' : 'green'},
{'name' : 'digg', 'color' : 'red'},
{'name' : 'idle', 'color' : 'cyan'},
{'name' : 'move', 'color' : 'yellow'}
];

function createActionNodesDisplay() {
	
	var displaySpace = $("#setActions");
	$.each(actionNodesItems, function (i, item) {
		displaySpace.append('<li id="setAction_' + item.name + '" class="setAction" name="' + item.name + '">' + item.name +'</li>');
		var domItem = $('#setAction_' + item.name);
		domItem.data('name', item.name);
		domItem.data('color', item.color);			
	});
}

function initActionNodes() {
	createActionNodesDisplay();
	$('.setAction').click(function(event){
		var type = $(this).attr('name');
//		alert("click " + type);
		game.setAction = type;
		$(".setAction").css('background-color', 'white');
		$(this).css('background-color', $(this).data('color'));
	});

}
