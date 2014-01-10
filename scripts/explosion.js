
var Explosion = function (col, row, type) {
	
	// Initialize this.rect with only x and y coordinates
	this.rect = {
		x: game.getPixels(col),
		y: game.getPixels(row)
	};
	this.rect.width = TILE_SIZE;
	this.rect.height = TILE_SIZE;
	this.rect.right = this.rect.x + this.rect.width;
	this.rect.bottom = this.rect.y + this.rect.height;
	
	this.type = type;
	if (this.type === 1) {
		this.el = $('<div class="exp bomb s1">');
	}
	else {//this.type === 2
		this.el = $('<div class="exp fire">');
	}
	
	this.lifeTime = 0;
	
	this.el.css({
		left: this.rect.x,
		top: this.rect.y,
		width: this.rect.width,
		height: this.rect.height
	});
};

Explosion.prototype.onFrame = function (delta) {
	
	this.lifeTime += delta;
	
	if (this.lifeTime <= 2.5) {
		this.el.toggleClass('s1', Math.floor(this.lifeTime / TICKS_LENGTH) % 2 === 0);
		this.el.toggleClass('s2', Math.floor(this.lifeTime / TICKS_LENGTH) % 2 === 1);
	}
	else if (this.lifeTime <= 3.0) {
		this.el.removeClass('s1');
		this.el.removeClass('s2');
		this.el.addClass('s3');
	}
	else if (this.lifeTime <= 5.0) {
		this.el.removeClass('s3');
		this.el.removeClass('bomb');
		this.el.addClass('fire');
		this.type = 2;
	}
	else {
		this.el.remove();
		this.type = 0;
	}
};