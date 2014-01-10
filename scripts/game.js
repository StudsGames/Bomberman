/**
 * Main game class.
 * @param {Element} el DOM element containig the game.
 * @constructor
 */
var Game = function (el) {
	
	this.el = el;
	this.player = new Player(this.el.find('.player'));
	this.boxesEl = el.find('.boxes');
	this.explosionsEl = el.find('.explosions');
	this.worldEl = el.find('.world');
	this.debugGrids = [];
	this.debugGridsEl = this.worldEl.append('<div class="debug-grids">').find('.debug-grids');
	
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
	
	// Clear all existing explosions
	this.explosions = [];
	this.explosionsEl.html('');
	
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
	$('.debug').css('color', '#FF0000');
};

Game.prototype.unFreezeGame = function () {
	// Only unFreezeGame if the game is freezed
	if (!this.isPlaying) {
		this.isPlaying = true;
		
		// Restart the onFrame loop
		this.lastFrame = +new Date() / 1000;
		requestAnimFrame(this.onFrame);
		
		// DEBUG
		$('.debug').css('color', '#00AA00');
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
	
	// Add walls like classic bomberman
	for (var row = 0; row < 6; row++) {
		for (var col = 0; col < 6; col++) {
			var newCol = (col * 2) + 1;
			var newRow = (row * 2) + 1;
			this.addBox(new Box(newCol, newRow, 1));
		}
	}
	
	// Add random 50 crates
	for (var i = 0; i < 50; i++)
	{
		// While the basic gameplay is not done, row and column 0 and 12 will not be occupied
		var col = this.getRandom(1, 11);
		var row = this.getRandom(1, 11);
		
		// To make sure that some idiot will not ask for more crates than
		// there is available space, the loop will only have limited tries
		for (var k = 0; (this.isTileAvailable(col,row) === false && k < 99); k++)
		{
			col = this.getRandom(1, 11);
			row = this.getRandom(1, 11);
		}
		
		if (this.isTileAvailable(col,row))
			this.addBox(new Box(col, row, 2));
	}
	
	
	
	// Debug grids
	for (var row = 0; row < 13; row++) {
		for (var col = 0; col < 13; col++) {
			var grid = new Grid(col, row);
			this.debugGrids.push(grid);
			this.debugGridsEl.append(grid.el);
		}
	}
	
};

Game.prototype.addBox = function (box) {
	this.boxes.push(box);
	this.boxesEl.append(box.el);
};

// Getter function to access this.boxes array
Game.prototype.forEachBox = function (handler) {
	this.boxes.forEach(handler);
};

Game.prototype.addExplosion = function (explosions) {
	this.explosions.push(explosions);
	this.explosionsEl.append(explosions.el);
};

// Getter function to access this.explosions array
Game.prototype.forEachExplosion = function (handler) {
	this.explosions.forEach(handler);
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
	// All bombs and fires
	this.forEachExplosion(function (e) {
		e.onFrame(delta);
		// remove it from the array
		if (e.type == 0) {
			var eIndex = game.explosions.indexOf(e);
			if (eIndex > -1) {
				game.explosions.splice(eIndex, 1);
			}
		}
	});
	
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



// DEBUG GRID MODEL START
var Grid = function (col, row) {
	this.rect = { x: col * TILE_SIZE, y: row * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE };
	this.rect.right = this.rect.x + this.rect.width;
	this.rect.bottom = this.rect.y + this.rect.height;
	this.el = $('<div class="grid c' + col + ' r' + row + '">');
	
	this.el.css({
		left: this.rect.x,
		top: this.rect.y,
		width: this.rect.width,
		height: this.rect.height
	});
};
Game.prototype.forEachGrid = function (handler) {
	this.debugGrids.forEach(handler);
};
// DEBUG GRID MODEL STOP



// Multiplay tile numer (column or row) by TILE_SIZE(30)
Game.prototype.getPixels = function (tiles) {
	return tiles * TILE_SIZE;
};

Game.prototype.getTiles = function (pixels) {
	return Math.floor(pixels / 30.0);
}

// Check if tile is occupied, if it is it will return false
Game.prototype.isTileAvailable = function (col, row) {
	
	var x = this.getPixels(col);
	var y = this.getPixels(row);
	var checkIsTileAvailable = true;
	
	if (checkIsTileAvailable)
	{
		this.forEachExplosion(function (e) {
			if (e.rect.x <= x && e.rect.right > x &&
				e.rect.y <= y && e.rect.bottom > y) {
				
				checkIsTileAvailable = false;
			}
		});
	}
	
	if (checkIsTileAvailable)
	{
		this.forEachBox(function (b) {
			if (b.rect.x <= x && b.rect.right > x &&
				b.rect.y <= y && b.rect.bottom > y) {
				
				checkIsTileAvailable = false;
			}
		});
	}
	
	return checkIsTileAvailable;
};

// Return a random number between min and max
Game.prototype.getRandom = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
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
