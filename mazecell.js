var MazeCell = function MazeCell(x, y, w, h)
{
	this.x = x; 
	this.y = y; 
	this.w = w;
	this.h = h;

	this.filled = true;

	this.isFilled = function()
	{
		return this.filled;
	}

	this.setFilled = function(filled)
	{
		this.filled = filled;
	}

	this.render = function()
	{
		noStroke();
		if(this.isFilled())
		{
			// fal
			fill('rgb(50,50,50)');
			rect(this.x, this.y, this.x+this.w, this.y+this.h);
		}
		else
		{
			// járat
			fill('rgb(200,200,200)');
			rect(this.x, this.y, this.x+this.w, this.y+this.h);
		}
	}
}