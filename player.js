class Player extends Entity {
	
	constructor(pos, w, h) {
        super(pos, w, h);
        this.img_player = loadImage("images/player.png");
        this.token = new BasicToken(pos, w, h);
    }    
    getImg() {
        return this.img_player;
    }
    render() {
        super.render();
        if(this.token !== undefined) {
            this.token.setPos(createVector(this.pos.x + this.w/3, this.pos.y + this.h/3));
            //console.log(this.token.pos);
            this.token.render();
        }
    }
}