var KEYS = {
	186: 'bomb',
	32: 'space',
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down'
};

/**
 * Controls singleton class.
 * @constructor
 */
var Controls = function () {
	this.keys = {};
	this.inputVec = { x: 0, y: 0 };
	
	$(window)
		.on('keydown', this.onKeyDown.bind(this))
		.on('keyup', this.onKeyUp.bind(this));
};

Controls.prototype.onKeyDown = function (e) {
	if (e.keyCode in KEYS && !this.keys[KEYS[e.keyCode]]) {
		var keyName = KEYS[e.keyCode];
		this.keys[keyName] = true;
		
		return false;
	}
};

Controls.prototype.onKeyUp = function (e) {
	if (e.keyCode in KEYS) {
		var keyName = KEYS[e.keyCode];
		this.keys[keyName] = false;
	}
	
	// pause key and p
	if (e.keyCode == 19 || e.keyCode == 80)
		// This will not work if requirejs is used (access to game.pause())
		game.pause();
	
	// Only for debugging
	if (!game.isPlaying)
		console.log('KeyCode: ' + e.keyCode);
};

Controls.prototype.onFrame = function () {
	
	if (this.keys.right) {
		this.inputVec.x = 1;
	} else if (this.keys.left) {
		this.inputVec.x = -1;
	} else {
		this.inputVec.x = 0;
	}
	
	if (this.keys.down) {
		this.inputVec.y = 1;
	} else if (this.keys.up) {
		this.inputVec.y = -1;
	} else {
		this.inputVec.y = 0;
	}
};
