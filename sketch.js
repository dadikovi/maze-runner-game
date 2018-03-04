var fa;
var canv_width = 500;
var canv_height = 500;
var mazeSize = 15;
var maze;

function setup() {
	colorMode(RGB, 100);
	maze = new Maze(canv_width, canv_height, mazeSize, mazeSize);
	frameRate(60);
	createCanvas(canv_width, canv_height);
}

function draw() 
{
	fill('rgb(50,50,50)');
	rect(0, 0, canv_width, canv_height);	
	
	maze.render();
}

function keyTyped()
{
	var moveVector;

	if(key === 'w')
	{
		moveVector = createVector(0, -1);
	}
	else
	if(key === 's')
	{
		moveVector = createVector(0, 1);
	}
	else
	if(key === 'a')
	{
		moveVector = createVector(-1, 0);
	}
	else
	if(key === 'd')
	{
		moveVector = createVector(1, 0);
	}

	if(moveVector !== undefined)
		maze.movePlayer(moveVector);

	if(key === 'q')
	{
		maze.dropBug();
	}

	if(key === ' ')
	{
		maze.continueGame();
	}
}