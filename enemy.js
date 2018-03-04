class Enemy extends Entity {
	constructor(pos, w, h) {
		super(pos, w, h);
		this.img_enemy = loadImage("images/ghost.png");
	}
	getImg() {
		return this.img_enemy;
	}
}