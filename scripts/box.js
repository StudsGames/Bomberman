
var Box = function (col, row, type) {
	
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
		this.el = $('<div class="box wall">');
	}
	else {//this.type === 2
		this.el = $('<div class="box crate">');
	}
	
	this.el.css({
		left: this.rect.x,
		top: this.rect.y,
		width: this.rect.width,
		height: this.rect.height
	});
};
