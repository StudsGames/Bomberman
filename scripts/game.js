/**
 * Main game class.
 * @param {Element} el DOM element containig the game.
 * @constructor
 */
var Game = function(el) {
	
	this.el = el;
	this.player = new Player(this.el.find('.player'), this);
	//this.platformsEl = el.find('.platforms');
	//this.worldEl = el.find('.world');
	
	this.isPlaying = false;
	
	// Cache a bound onFrame since we need it each frame.
	this.onFrame = this.onFrame.bind(this);
};

/**
 * Starts the game.
 */
Game.prototype.start = function () {
	this.player.reset();
	
	this.unFreezeGame();
};

Game.prototype.freezeGame = function () {
	this.isPlaying = false;
};

Game.prototype.unFreezeGame = function () {
	// Only unFreezeGame if the game is freezed
	if (!this.isPlaying) {
		this.isPlaying = true;
		
		// Restart the onFrame loop
		this.lastFrame = +new Date() / 1000;
		requestAnimFrame(this.onFrame);
	}
};

Game.prototype.pause = function () {
	// Toggle freeze game
	if (this.isPlaying) {
		this.freezeGame();
	}
	else {
		this.unFreezeGame();
	}
};

/**
 * Runs every frame. Calculates a delta and allows each game entity to update itself.
 */
Game.prototype.onFrame = function () {
	
	// Enable freeze/pause feature
	if (!this.isPlaying) {
		return;
	}
	
	// Calculate delta
	var now = +new Date() / 1000;
	var delta = now - this.lastFrame;
	this.lastFrame = now;
	
	// Calling other onFrame functions
	controls.onFrame(delta);
	this.player.onFrame(delta);
	
	// Request next frame.
	requestAnimFrame(this.onFrame);
};

/**
 * Cross browser RequestAnimationFrame
 */
var requestAnimFrame = (function () {
	return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(/* function */ callback) {
				window.setTimeout(callback, 1000 / 60);
			};
})();