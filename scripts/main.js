
// Global contants
var PLAYER_SPEED = 400;
var PLAYER_OFFSET = 15;

var WORLD_SIZE = { height: $('.world').height(), width: $('.world').width() };

// Global instants
var controls;
var game;

$(document).ready(function () {
	
	controls = new Controls();
	game = new Game($('.game'));
	
	// Start the game
	game.start();
	
});

var showLiveness = false;
function debugUpdateFramerate(frames)
{
	var liveness = (showLiveness ? '.' : '');
	$('.debug-framerate').html(frames + liveness);
	
	showLiveness = !showLiveness;
}
