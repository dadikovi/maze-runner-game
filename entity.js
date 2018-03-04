class Entity
{    
    constructor(pos, w, h) {
        this.pos = pos;
        this.w = w;
        this.h = h;
    }

	getImg() {
        return null;
    }
	render()
	{
		image(this.getImg(), this.pos.x-this.w/2, this.pos.y-this.h/2, this.w, this.h);
	}
	setPos(pos)
	{
		this.pos = pos;
	}
}