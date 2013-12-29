
var Player = function(el, game) {
	this.el = el;
	this.game = game;
};

Player.prototype.reset = function () {
	this.pos = { x: 100, y: 100 };// Positions
	this.vel = { x: 0, y: 0 };// Velocity
	this.tile = 0;// Tile
};

Player.prototype.onFrame = function(delta) {
	
	// Player input
	this.vel.x = controls.inputVec.x * PLAYER_SPEED;
	this.vel.y = controls.inputVec.y * PLAYER_SPEED;
	
	var oldY = this.pos.y;
	this.pos.x += delta * this.vel.x;
	this.pos.y += delta * this.vel.y;
	
	// Collision detection
	//TODO
	
	// Update UI
	this.el.css('transform', 'translate3d(' + this.pos.x + 'px,' + this.pos.y + 'px,0)');
	
	//this.el.toggleClass('right', this.til === 0);
	//this.el.toggleClass('left', this.til === 1);
	//this.el.toggleClass('jumping', this.vel.y < 0);
	//this.el.toggleClass('walking', this.vel.x !== 0);
};