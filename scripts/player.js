
var Player = function (el) {
	this.el = el;
};

Player.prototype.reset = function () {
	this.pos = { x: 15, y: 15 };
	this.vel = { x: 0, y: 0 };
	this.skin = 0;
};

Player.prototype.onFrame = function (delta) {
	
	// Player input
	this.vel.x = controls.inputVec.x * PLAYER_SPEED;
	this.vel.y = controls.inputVec.y * PLAYER_SPEED;
	
	if (controls.keys.bomb) {
		var col = game.getTiles(this.pos.x);
		var row = game.getTiles(this.pos.y);
		if (game.isTileAvailable(col,row))
			game.addExplosion(new Explosion(col, row, 1));
	}
	
	
	// Player movement
	this.pos.x += delta * this.vel.x;
	this.pos.y += delta * this.vel.y;
	
	
	// Collision detection
	this.pos = this.worldCollisionDetection(this.pos);
	this.pos = this.boxesCollisionDetection(this.pos);
	
	// Debug
	this.debugGridCollisionDetection(this.pos);
	
	
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

Player.prototype.worldCollisionDetection = function (pos) {
	
	if ((pos.x - PLAYER_OFFSET) < 0) pos.x = PLAYER_OFFSET;
	if ((pos.y - PLAYER_OFFSET) < 0) pos.y = PLAYER_OFFSET;
	if ((pos.x + PLAYER_OFFSET) > WORLD_SIZE.width) pos.x = (WORLD_SIZE.width - PLAYER_OFFSET);
	if ((pos.y + PLAYER_OFFSET) > WORLD_SIZE.height) pos.y = (WORLD_SIZE.height - PLAYER_OFFSET);
	
	return pos;
};

Player.prototype.boxesCollisionDetection = function (pos) {
	
	// Cache player rect position
	var pBottom = pos.y + PLAYER_OFFSET;
	var pTop = pos.y - PLAYER_OFFSET;
	var pRight = pos.x + PLAYER_OFFSET;
	var pLeft = pos.x - PLAYER_OFFSET;
	
	game.forEachBox(function (b) {
		
		// Check for collision (from section 'Bounding box test' here: http://devmag.org.za/2009/04/13/basic-collision-detection-in-2d-part-1/ )
		var isCollision = !((pBottom <= b.rect.y) || (pTop >= b.rect.bottom) || (pRight <= b.rect.x) || (pLeft >= b.rect.right));
		
		// If collision then find the best position and move player to that position
		if (isCollision)
		{
			// Calculate all 4 position options
			var posY1 = b.rect.y - PLAYER_OFFSET;
			var posY2 = b.rect.bottom + PLAYER_OFFSET;
			var posX1 = b.rect.x - PLAYER_OFFSET;
			var posX2 = b.rect.right + PLAYER_OFFSET;
			
			// Calucate distance
			var posLenY1 = Math.abs(posY1 - pBottom);
			var posLenY2 = Math.abs(posY2 - pTop);
			var posLenX1 = Math.abs(posX1 - pRight);
			var posLenX2 = Math.abs(posX2 - pLeft);
			
			// Find shortest distance and move player to that distance
			var shortestLen = Math.min(posLenY1, posLenY2, posLenX1, posLenX2);
			if (shortestLen === posLenY1) pos.y = posY1;
			else if (shortestLen === posLenY2) pos.y = posY2;
			else if (shortestLen === posLenX1) pos.x = posX1;
			else if (shortestLen === posLenX2) pos.x = posX2;
		}
	});
	
	return pos;
};

Player.prototype.debugGridCollisionDetection = function (pos) {
	
	// Cache player rect position
	var pBottom = pos.y + PLAYER_OFFSET;
	var pTop = pos.y - PLAYER_OFFSET;
	var pRight = pos.x + PLAYER_OFFSET;
	var pLeft = pos.x - PLAYER_OFFSET;
	
	$('.debug-grids .grid.here').removeClass('here');
	game.forEachGrid(function (g) {
		
		// Check for collision (from section 'Bounding box test' here: http://devmag.org.za/2009/04/13/basic-collision-detection-in-2d-part-1/ )
		var isCollision = !((pBottom <= g.rect.y) || (pTop >= g.rect.bottom) || (pRight <= g.rect.x) || (pLeft >= g.rect.right));
		
		// If collision then find the best position and move player to that position
		if (isCollision)
		{
			g.el.toggleClass('here', true);
		}
	});
};