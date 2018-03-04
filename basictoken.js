class BasicToken extends Entity {
	constructor(pos, w, h) {
		super(pos, w, h);
		this.img_token = loadImage("images/token.png");
	}
	getImg() {
		return this.img_token;
	}
}