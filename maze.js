Direction = 
{
	UP : 1,
	DOWN : 2,
	RIGHT : 3,
	LEFT : 4
}

MessageLevel =
{
	SUCCESS : 1,
	ERROR : 2,
	WELCOME : 3
}

class Maze
{
	constructor(w, h, vsize, hsize) {
		this.vsize = vsize; 
		this.hsize = hsize; 
		this.w = w;
		this.h = h;
		this.cells = [];
		this.cellw = this.w / this.hsize;
		this.cellh = this.h / this.vsize;

		this.startPoint = createVector(5, 0);
		
		this.playerPoint = this.startPoint;
		this.enemyPoint;
		this.goalPoint;

		this.enemyDropped = false;
		this.goalDropped = false;
		this.level = 10; // the smaller is harder
		this.displayLevel = 0;
		this.suspended = false;

		this.looseReason;
		this.win=false;

		this.init();

		this.player = new Player(this.getActualplayerPoint(), this.cellw, this.cellh);
		this.enemy = new Enemy(this.getActualenemyPoint(), this.cellw, this.cellh, this.img_lakosenemy);
		this.Target;

		this.frameCount = 0;
		this.enemyDirection;
	}

	preload()
	{

	}

	getActualplayerPoint()
	{
		return createVector(this.playerPoint.x*this.cellw+this.cellw/2,
							this.playerPoint.y*this.cellh+this.cellh/2)
	}

	getActualenemyPoint()
	{
		return createVector(this.enemyPoint.x*this.cellw+this.cellw/2,
							this.enemyPoint.y*this.cellh+this.cellh/2)
	}

	getActualTargetPoint()
	{
		return createVector(this.TargetPoint.x*this.cellw+this.cellw/2,
							this.TargetPoint.y*this.cellh+this.cellh/2)
	}

	init()
	{

		/* Width and height of a cell */
		var cellw = this.w / this.hsize;
		var cellh = this.h / this.vsize;

		for(var v = 0; v<this.vsize; v++)
		{
			this.cells[v] = [];
		}

		/* Create the empty cell */
		for(var v = 0; v<this.vsize; v++)
		{
			for(var h = 0; h<this.hsize; h++)
			{
				this.cells[v][h] = new MazeCell(h*cellw, v*cellh, cellw, cellh);
			}
		}

		this.generate(this.cells, this.startPoint.x, this.startPoint.y, 0);
	}

	generate(cells, x, y, szint)
	{
		var i;
		var Directionok = [ Direction.UP, Direction.DOWN, Direction.RIGHT, Direction.LEFT ];

		cells[y][x].setFilled(false);
		
		/* Drop enemy */
		if(szint === this.level && !this.enemyDropped)
		{
			this.enemyDropped = true;
			this.enemyPoint = createVector(x, y);
		}

		/* Drop goal */
		if(szint === this.level + Math.round(this.level * 0.5) && !this.goalDropped)
		{
			this.goalDropped = true;
			this.TargetPoint = createVector(x, y);
			this.Target = new Target(this.getActualTargetPoint(), this.cellw, this.cellh, this.img_Target);
		}

		for(i = 0; i< 4; ++i)
		{
			var r = Math.round(Math.random() * 4);
			var Direction_temp = Directionok[i];
			Directionok[i] = Directionok[r];
			Directionok[r] = Direction_temp;
		}

		for(i = 0; i < 4; ++i)
		{
			switch(Directionok[i])
			{
				case Direction.UP:
					if (y >= 2 && cells[y - 1][x].isFilled()) 
					{
		                cells[y - 1][x].setFilled(false);  /* elinditjuk arraUPe a jaratot */
		                this.generate(cells, x, y - 2, ++szint);   /* es rekurzive megyunk tovabb */
		            }
		            break;
		        case Direction.LEFT:
		            if (x >= 2 && cells[y][x - 2].isFilled()) 
		            {		            	
		                cells[y][x - 1].setFilled(false);
		                this.generate(cells, x - 2, y, ++szint);
		            }
		            break;
		        case Direction.DOWN:
		            if (y < this.vsize - 2 && cells[y + 2][x].isFilled()) 
		            {		            	
		                cells[y + 1][x].setFilled(false);
		                this.generate(cells, x, y + 2, ++szint);
		            }
		            break;
		        case Direction.RIGHT:
		            if (x < this.hsize - 2 && cells[y][x + 2].isFilled())
		            {		            	
		                cells[y][x + 1].setFilled(false);
		                this.generate(cells, x + 2, y, ++szint);
		            }
		            break;
			}
		}

	}	

	render()
	{
		this.frameCount++;

		for(var v = 0; v<this.vsize; v++)
		{
			for(var h = 0; h<this.hsize; h++)
			{
				this.cells[v][h].render();
			}
		}

		this.player.render();
		this.enemy.render();
		this.Target.render();

		/* Moving enemy... */
		if( this.frameCount > this.level*5 )
		{
			this.frameCount = 0;
			this.moveenemy();
		}

		if(this.looseReason !== undefined)
		{
			this.loose(this.looseReason);
		}
		if(this.win) {
			this.printWin();
		}
		if(this.displayLevel < 1) {
			this.welcome();
		}
		this.renderLevel();
	}

	movePlayer(where)
	{
		var playerNextPos = p5.Vector.add(where, this.playerPoint);

		if(!this.cells[playerNextPos.y][playerNextPos.x].isFilled())
		{
			this.playerPoint = playerNextPos;
			this.player.setPos(this.getActualplayerPoint());
		}

		if(this.enemyPoint.equals(this.playerPoint))
		{
			this.looseReason = "The ghost caught you!";
		}
	}
 
	moveenemy()
	{
		var Directionok = [ Direction.UP, Direction.DOWN, Direction.RIGHT, Direction.LEFT ];
		var where;
		var enemyNextPosByPrevDirection;

		/* Keep the current direction if exists. */
		if(this.enemyDirection !== undefined)
		{
			enemyNextPosByPrevDirection = p5.Vector.add(this.enemyDirection, this.enemyPoint);
			if(enemyNextPosByPrevDirection.y >= 1 && enemyNextPosByPrevDirection.y < this.vsize
				&& enemyNextPosByPrevDirection.x >= 1 && enemyNextPosByPrevDirection.y < this.hsize
				&& !this.cells[enemyNextPosByPrevDirection.y][enemyNextPosByPrevDirection.x].isFilled())
			{
				where = this.enemyDirection;
			}
		}

		/* Move in the directions of player */
		if(where === undefined) {
			var distance = createVector(this.playerPoint.x-this.enemyPoint.x, this.playerPoint.y-this.enemyPoint.y);
			distance = distance.normalize();

			if(distance.heading() < 0.78 && distance.heading() > -0.78) {
				where = createVector(1, 0);
			} else if(distance.heading() < -0.78 && distance.heading() > -2.35) {
				where = createVector(0, -1);
			} else if(distance.heading() < 2.35 && distance.heading() > 0.78) {
				where = createVector(0, 1);
			} else {
				where = createVector(-1, 0);
			}
		}

		var enemyNextPos = p5.Vector.add(where, this.enemyPoint);

		/* Double-check, physics pls */
		if(enemyNextPos.y >= 1 && enemyNextPos.y < this.vsize
			&& enemyNextPos.x >= 1 && enemyNextPos.y < this.hsize
			&& !this.cells[enemyNextPos.y][enemyNextPos.x].isFilled())
		{
			this.enemyPoint = enemyNextPos;
			this.enemy.setPos(this.getActualenemyPoint());

			this.enemyDirection = where;
		}

		if(this.enemyPoint.equals(this.playerPoint))
		{
			this.looseReason = "The gost caught you!";
		}
	}

	continueGame() {
		console.log("Continue...");
		if(this.suspended) {
			this.suspended = false;
			this.looseReason = undefined;
			this.win = false;
			this.displayLevel++;
			this.level--;
			this.enemyDropped = false;
			this.goalDropped = false;
			this.init();
			loop();			
		}
	}
	
	loose(reason)
	{
		this.displayLevel = 1;
		this.level = 10;
		this.showMessage("You loose! " + reason, MessageLevel.ERROR);
	}

	printWin()
	{
		this.showMessage("You win!", MessageLevel.SUCCESS);
	}

	welcome()
	{
		this.showMessage("Drop the key to the target!\nControl: W-A-S-D\nDrop the key: Q", MessageLevel.WELCOME);
	}

	showMessage(displayText, level)
	{
		var textColor = this.getMessageColor(level);
		noLoop();
		this.suspended = true;
		textSize(25);
		fill(color('rgb(200, 200, 200)'));
		rect(this.w*0.1, this.h*0.1, this.w*0.8, this.h*0.5);
		fill(textColor);
		text(displayText, this.w*0.2, this.h*0.2, this.w*0.6, this.h*0.4);
		textSize(15);
		text("Press [space] to start / continue game", this.w*0.2, this.h*0.45, this.w*0.6, this.h*0.4);
	}

	renderLevel()
	{
		textSize(15);
		fill('yellow');
		text("Level: " + this.displayLevel, this.w*0.8, this.h*0.95, this.w*0.9, this.h);
	}

	getMessageColor(level)
	{
		switch(level)
		{
			case MessageLevel.ERROR:
				return color('rgb(100, 0, 0)');
			case MessageLevel.SUCCESS:
				return color('rgb(0, 100, 0)');
			default:
				return color('rgb(0, 0, 0)');
		}
	}

	dropBug()
	{
		if(this.playerPoint.equals(this.TargetPoint))
		{
			this.win = true;
		}
		else
		{
			this.looseReason = "This is not the target!";
		}
	}
}