
// Global contants
var PLAYER_SPEED = 400;
var PLAYER_WIDTH = 80;

// Global instants
var controls;
var game;

$(document).ready(function () {
	
	controls = new Controls();
	game = new Game($('.game'));
	
	// Start the game
	game.start();
	
});