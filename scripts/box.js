
var Box = function(rect, type) {
	
	this.rect = rect;
	this.rect.right = rect.x + rect.width;
	
	if (type === 1) {
		this.el = $('<div class="box wall">');
	}
	else {//type === 2
		this.el = $('<div class="box crate">');
	}
	
	this.el.css({
		left: rect.x,
		top: rect.y,
		width: rect.width,
		height: rect.height
	});
};
