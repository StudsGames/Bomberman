
// Global contants
var PLAYER_SPEED = 400;
var PLAYER_OFFSET = 15;

var WORLD_SIZE = { height: $('.world').height(), width: $('.world').width() };
var TILE_SIZE = 30;

// Global instants
var controls;
var game;

$(document).ready(function () {
	
	controls = new Controls();
	game = new Game($('.game'));
	
	// Start the game
	game.start();
	
	
	// Debug
	$('.debug-grids .grid').click(function () {
		var coordinates = $(this).attr('class').replace('grid c','').replace(' r',',');
		var x = coordinates.split(',')[0];
		var y = coordinates.split(',')[1];
		console.log('isTileAvailable(' + x + ',' + y + '):' + game.isTileAvailable(x,y));
	});
});

var showLiveness = false;
function debugUpdateFramerate(frames)
{
	var liveness = (showLiveness ? '.' : '');
	$('.debug-framerate').html(frames + liveness);
	
	showLiveness = !showLiveness;
}
