class Target extends Entity {
	constructor(pos, w, h) {
		super(pos, w, h);
		this.img_target = loadImage("images/target.png");
	}
	getImg() {
		return this.img_target;
	}
}