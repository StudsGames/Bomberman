
// Global contants
var PLAYER_SPEED = 400;
var PLAYER_OFFSET = 15;

var WORLD_SIZE = { height: $('.world').height(), width: $('.world').width() };
var TILE_SIZE = 30;
var TICKS_LENGTH = 0.2;

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
	showLiveness = !showLiveness;
	$('.debug .framerate span').html(frames + liveness);
	
	var totalWalls = 0;
	var totalCrates = 0;
	game.forEachBox(function (b) {
		if (b.type === 1) totalWalls++;
		else if (b.type === 2) totalCrates++;
	});
	$('.debug .walls span').html(totalWalls);
	$('.debug .crates span').html(totalCrates);
	
	var totalBombs = 0;
	var totalFires = 0;
	game.forEachExplosion(function (e) {
		if (e.type === 1) totalBombs++;
		else if (e.type === 2) totalFires++;
	});
	$('.debug .bombs span').html(totalBombs);
	$('.debug .fires span').html(totalFires);
}
