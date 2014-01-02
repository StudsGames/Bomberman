/**
 * Main game class.
 * @param {Element} el DOM element containig the game.
 * @constructor
 */
var Game = function(el) {
	
	this.el = el;
	this.player = new Player(this.el.find('.player'), this);
	this.boxesEl = el.find('.boxes');
	//this.worldEl = el.find('.world');
	
	this.isPlaying = false;
	
	// Cache a bound onFrame since we need it each frame.
	this.onFrame = this.onFrame.bind(this);
};

/**
 * Starts the game.
 */
Game.prototype.start = function () {
	// Clear all existing boxes
	this.boxes = [];
	this.boxesEl.html('');
	
	// Create new boxes
	this.createBoxes();
	// Restart player attributes
	this.player.reset();
	
	
	// Start game loop
	this.unFreezeGame();
};

Game.prototype.freezeGame = function () {
	this.isPlaying = false;
	
	// DEBUG
	$('.debug-framerate').css('color', '#FF0000');
};

Game.prototype.unFreezeGame = function () {
	// Only unFreezeGame if the game is freezed
	if (!this.isPlaying) {
		this.isPlaying = true;
		
		// Restart the onFrame loop
		this.lastFrame = +new Date() / 1000;
		requestAnimFrame(this.onFrame);
		
		// DEBUG
		$('.debug-framerate').css('color', '#00AA00');
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

Game.prototype.createBoxes = function () {
	
	// Walls
	for (var i = 0; i < 6; i++) {
		this.addBox(new Box({ x: 30, y: (60 * i + 30), width: 30, height: 30 }, 1));
		this.addBox(new Box({ x: 90, y: (60 * i + 30), width: 30, height: 30 }, 1));
		this.addBox(new Box({ x: 150, y: (60 * i + 30), width: 30, height: 30 }, 1));
		this.addBox(new Box({ x: 210, y: (60 * i + 30), width: 30, height: 30 }, 1));
		this.addBox(new Box({ x: 270, y: (60 * i + 30), width: 30, height: 30 }, 1));
		this.addBox(new Box({ x: 330, y: (60 * i + 30), width: 30, height: 30 }, 1));
	}
	
	// Crates
	this.addBox(new Box({ x: 120, y: 0, width: 30, height: 30 }, 2));
	this.addBox(new Box({ x: 150, y: 0, width: 30, height: 30 }, 2));
	this.addBox(new Box({ x: 210, y: 0, width: 30, height: 30 }, 2));
	this.addBox(new Box({ x: 240, y: 0, width: 30, height: 30 }, 2));
	this.addBox(new Box({ x: 270, y: 0, width: 30, height: 30 }, 2));
	
	this.addBox(new Box({ x: 120, y: 30, width: 30, height: 30 }, 2));
	this.addBox(new Box({ x: 180, y: 30, width: 30, height: 30 }, 2));
	
};

Game.prototype.addBox = function(box) {
	this.boxes.push(box);
	this.boxesEl.append(box.el);
};

/**
 * Runs every frame. Calculates a delta and allows each game entity to update itself.
 */
var debugFrames = 0;
var debugDeltaSum = 0;
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
	
	// DEBUG start
	debugDeltaSum += delta;
	debugFrames++;
	
	if (debugDeltaSum > 1) {
		// Display frames
		debugUpdateFramerate(debugFrames);
		// Reset frame counter
		debugDeltaSum = 0;
		debugFrames = 0;
	}
	// DEBUG stop
	
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
