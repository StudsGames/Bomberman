
var Player = function(el, game) {
	this.el = el;
	this.game = game;
};

Player.prototype.reset = function () {
	this.pos = { x: 15, y: 15 };
	this.vel = { x: 0, y: 0 };
	this.skin = 0;
};

Player.prototype.onFrame = function(delta) {
	
	// Player input
	this.vel.x = controls.inputVec.x * PLAYER_SPEED;
	this.vel.y = controls.inputVec.y * PLAYER_SPEED;
	
	
	// Player movement
	this.pos.x += delta * this.vel.x;
	this.pos.y += delta * this.vel.y;
	
	
	// Collision detection
	if ((this.pos.x - PLAYER_OFFSET) < 0) this.pos.x = PLAYER_OFFSET;
	if ((this.pos.y - PLAYER_OFFSET) < 0) this.pos.y = PLAYER_OFFSET;
	if ((this.pos.x + PLAYER_OFFSET) > WORLD_SIZE.width) this.pos.x = (WORLD_SIZE.width - PLAYER_OFFSET);
	if ((this.pos.y + PLAYER_OFFSET) > WORLD_SIZE.height) this.pos.y = (WORLD_SIZE.height - PLAYER_OFFSET);
	
	// TODO: collision detection on boxes
	
	
	// Select correct player skin
	var lastSkin = this.skin;
	
	if (controls.inputVec.y < 0) this.skin = 0;
	else if (controls.inputVec.x > 0) this.skin = 1;
	else if (controls.inputVec.y > 0) this.skin = 2;
	else if (controls.inputVec.x < 0) this.skin = 3;
	
	if (lastSkin !== this.skin) {
		this.el.toggleClass('face-north', this.skin === 0);
		this.el.toggleClass('face-east', this.skin === 1);
		this.el.toggleClass('face-south', this.skin === 2);
		this.el.toggleClass('face-west', this.skin === 3);
		lastSkin = this.skin;
	}
	
	
	// Update UI
	this.el.css('transform', 'translate3d(' + this.pos.x + 'px,' + this.pos.y + 'px,0)');
	
	
};
