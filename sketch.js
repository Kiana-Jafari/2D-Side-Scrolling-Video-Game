// Declare variables

/* The main variables related to the game character and game scenery are from the lectures.
Some of the other variables such as `cactus`, `warning sign`, and `sun`, and those which needed to be 
updated dynamically (like `canyonXPos` and `collectableXPos`) are written on my own.
Please note that I also changed some of the variable naming for the sake of plagiarism, 
to not have the same variables as other fellow students. */

var charX;
var charY;
var floorPos_y;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var canyon;
var collectable;

var treesX;
var treesY;

var cactus;
var warning;

var mountainsX;
var mountainsY;

var sun;
var firstCloud;
var secondCloud;

var cameraX = 0;

var canyonXPos;
var collectableXPos;

/* The first few variables related to game character and game interaction are from lectures. 
The rest of the initialized variables are written on my own. 
(i.e. `canyon`, `mountains`, `trees`, `cactus`, `clouds`, `warning`, and the `sun`).
The main idea behind some of the game sceneries is from the lectures or the instructions, 
such as canyon and collectable, but the initialized values for each variable have been changed.
The idea behind drawing a cactus is from a YouTube video,
(Link: https://editor.p5js.org/jesse_harding/sketches/Dl5TosS4V)
but initializing an array of objects for the cactus is an idea of mine. */

function setup()
{
	// Prepare the canvas for drawing
	createCanvas(1024, 576);
	floorPos_y = height * 3 / 4;
	charX = width / 2;
	charY = floorPos_y;

    // Initialize the variables
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	canyon = {x_Pos: 375, width: 75}
	
	collectable = {
		x_pos: 270, 
		y_pos: 330, 
		size: 30, 
		isFound: false}

	mountainsX = [100, 200, 860, 1050];
	mountainsY = floorPos_y;

	treesX = [150, 700, 900, 1300, 1450];
	treesY = height / 2;

	cactus = [
		{x: 800, y: 370, w: 25, h: 62, radius1: 15, radius2: 15, radius3: 4, radius4: 4}, // Cactus main body
		{x: 770, y: 380, w: 20, h: 35, radius1: 15, radius2: 15, radius3: 0, radius4: 0},
		{x: 770, y: 405, w: 35, h: 15, radius1: 0, radius2: 0, radius3: 0, radius4: 25}, // Cactus left arm
		{x: 835, y: 375, w: 20, h: 35, radius1: 15, radius2: 15, radius3: 0, radius4: 0},
		{x: 820, y: 405, w: 35, h: 15, radius1: 0, radius2: 0, radius3: 25, radius4: 0} // Cactus right arm
	];

	warning = {x: 100, y: 390}
	
	firstCloud = [
		{x_pos: 165, y_pos: 70, size: 50},
		{x_pos: 135, y_pos: 90, size: 50},
		{x_pos: 200, y_pos: 90, size: 50},
		{x_pos: 165, y_pos: 110, size: 50}
	];

	secondCloud = [
		{x_pos: 760, y_pos: 75, size: 50},
		{x_pos: 730, y_pos: 100, size: 60},
		{x_pos: 785, y_pos: 100, size: 60},
		{x_pos: 760, y_pos: 120, size: 50}
	];

	sun = {x: 195, y: 40, width: 60, height: 60}
}

/* The idea of updating the relative positions of each variable, scrolling, and trees 
is based on the given instruction, but the code is written on my own. 
The main code for the collectable has been changed and is located above the canyon 
to make it more challenging for the character to jump. 
Except for the background and the ground, all of the other scenes are written on my own. 
The values of the `canyon` are an improved version 
whose idea was derived from one of the classmates in the peer review. 
Since using an array of objects wouldn't be beneficial 
when it will only contain the x-positions of the mountains, 
I used an array of integers instead of an array of objects for drawing the mountains. 
Each value of the array represents the mountain's x-position. 
The idea of drawing shadows is completely my own, 
and I also shared it with my other fellows (in the discussion forum) 
to give them an idea for making their scenery more engaging. 
Shadows were drawn for both the `mountain` and the `clouds` objects. 
The idea and code of drawing a cactus using a `for loop` and 
the sun and the warning sign using an object are also my own. */

function draw()
{
	// Update relative positions repeatedly
	cameraX = charX - width / 2;
	canyonXPos = canyon.x_Pos - cameraX;
	collectableXPos = collectable.x_pos - cameraX;

	background(100, 155, 255); // Fill the sky blue
	noStroke();
	fill(0, 150, 0);
      
	// Draw the green ground
	rect(
		0, 
		floorPos_y, 
		width, 
		height - floorPos_y);

	// Implement scrolling
	push();
	translate(-cameraX, 0);

	/////////// GAME SCENERY ///////////
	
	// Canyon
	fill(99, 94, 45);
	rect(
		canyon.x_Pos,
		floorPos_y,
		canyon.width,
		height - floorPos_y);
      
	// Mountains
	for (var i = 0; i < mountainsX.length; i++)
	{
		fill(211);
		triangle(
			mountainsX[i] - 100, mountainsY,
			mountainsX[i] + 20, mountainsY - 300,
			mountainsX[i] + 100, mountainsY);
            
		// Shadows
		fill(128, 128, 128, 100);
		triangle(
			mountainsX[i] - 100, mountainsY,
			mountainsX[i] + 5, mountainsY - 265,
			mountainsX[i] + 100, mountainsY); // Offset y by a constant to make shadows
	}

	// Warning Sign
	fill(255);
	stroke(255, 0, 0);
	strokeWeight(7);
	beginShape();
		vertex(warning.x, warning.y);
		vertex(warning.x + 30, warning.y - 55);
		vertex(warning.x + 60, warning.y);
	endShape(CLOSE);

	noStroke();
	fill(88, 57, 39);
	rect(warning.x + 25, warning.y + 3, 10, 40);

	fill(0);
	textFont('Courier New');
	textSize(46);
	textAlign(CENTER, CENTER);
	text('!', warning.x + 30, warning.y - 19);

	// Collectable
	if (dist(charX, charY, collectableXPos, floorPos_y) < 10)
	{
		collectable.isFound = true;
	}

	if (collectable.isFound == false)
	{
		fill(255, 255, 0);
		stroke(139, 128, 0);
		strokeWeight(3);
		circle(
			collectable.x_pos, collectable.y_pos,
			collectable.size, collectable.size);

		fill(0);
		stroke(0);
		strokeWeight(1);
		textSize(20);
		textAlign(CENTER, CENTER);
		text('1', collectable.x_pos, collectable.y_pos);
		noStroke();
	}

	// Trees
	for (var i = 0; i < treesX.length; i++)
	{
		// Roots
		fill(150, 45, 0);
		rect(treesX[i] - 180, treesY + 44, 25, 100);

		// Leaves
		fill(35, 101, 51);
		circle(
			treesX[i] - 173, treesY - 10,
			treesY - 100, treesY - 100);
	}

	// Saguaro Cactus
	for (var i = 0; i < cactus.length; i++)
	{
		fill(34, 139, 34);
		rect(
			cactus[i].x, cactus[i].y, 
			cactus[i].w, cactus[i].h, 
			cactus[i].radius1, cactus[i].radius2, 
			cactus[i].radius3, cactus[i].radius4);
	}

	// Sun
	fill(255, 255, 0);
	ellipse(sun.x, sun.y, sun.width, sun.height);

	// Clouds
	for (var i = 0; i < firstCloud.length; i++)
	// console.log(firstCloud.length == secondCloud.length) -> true
	{
		// Shadows
		fill(0, 0, 0, 50);
		ellipse(
			firstCloud[i].x_pos,
			firstCloud[i].y_pos - 20,
			firstCloud[i].size,
			firstCloud[i].size);

		ellipse(
			secondCloud[i].x_pos,
			secondCloud[i].y_pos - 20,
			secondCloud[i].size,
			secondCloud[i].size);

		// Draw Clouds
		fill(255);
		ellipse(
			firstCloud[i].x_pos,
			firstCloud[i].y_pos - 30,
			firstCloud[i].size,
			firstCloud[i].size);

		ellipse(
			secondCloud[i].x_pos,
			secondCloud[i].y_pos - 30,
			secondCloud[i].size,
			secondCloud[i].size);
	}

	/////////// GAME CHARACTER ///////////

	/* The characters are from the previous projects. 
	I've been suggested by one of my classmates in the last peer review to add facial emotions 
	to my character when it falls or is standing in front to make my character more interesting.
	I drew a smile using the `arc` function, whose idea was also utilized in 
	"Programming exercise 10: Debug challenge: meltdown!". */

	// Jumping-left character
	if (isLeft && isFalling)
	{
		// Head
		fill(196, 164, 132);
		ellipse(charX - 50, charY - 80, 40, 40);

		// Hands
		fill(255, 0, 0);
		rect(charX - 100, charY - 55, 80, 20);

		// Body
		rect(charX - 70, charY - 50, 40, 40);

		// Feet
		fill(0);
		rect(charX - 75, charY - 10, 10, 10);
		rect(charX - 45, charY - 10, 10, 10);

		// Eyes
		stroke(0);
		strokeWeight(4);
		point(charX - 60, charY - 84);
	}

	// Jumping-right character
	else if (isRight && isFalling)
	{
		// Head
		fill(196, 164, 132);
		ellipse(charX - 50, charY - 80, 40, 40);

		// Hands
		fill(255, 0, 0);
		rect(charX - 70, charY - 60, 60, 20);

		// Body
		rect(charX - 70, charY - 50, 40, 40);

		// Feet
		fill(0);
		rect(charX - 65, charY - 10, 10, 10);
		rect(charX - 35, charY - 10, 10, 10);

		// Eyes
		stroke(0);
		strokeWeight(4);
		point(charX - 40, charY - 84);
	}

	// Walking left character
	else if (isLeft)
	{
		// Head
		fill(196, 164, 132);
		ellipse(charX - 50, charY - 80, 40, 40);

		// Hands
		fill(255, 0, 0);
		rect(charX - 90, charY - 60, 60, 20);

		// Body
		rect(charX - 70, charY - 50, 40, 40);

		// Feet
		fill(0);
		rect(charX - 70, charY - 10, 10, 10);
		rect(charX - 40, charY - 10, 10, 10);

		// Eyes
		stroke(0);
		strokeWeight(4);
		point(charX - 60, charY - 84);
    }

	// Walking right character
	else if (isRight)
	{
		// Head
		fill(196, 164, 132);
		ellipse(charX - 50, charY - 80, 40, 40);

		// Hands
		fill(255, 0, 0);
		rect(charX - 70, charY - 60, 60, 20);

		// Body
		rect(charX - 70, charY - 50, 40, 40);

		// Feet
		fill(0);
		rect(charX - 70, charY - 10, 10, 10);
		rect(charX - 40, charY - 10, 10, 10);

		// Eyes
		stroke(0);
		strokeWeight(4);
		point(charX - 40, charY - 84);
	}

	// Jumping facing forwards character
	else if (isFalling || isPlummeting)
	{
		// Head
		fill(196, 164, 132);
		ellipse(charX - 50, charY - 80, 40, 40);

		// Hands
		fill(255, 0, 0);
		rect(charX - 90, charY - 60, 80, 20);

		// Body
		rect(charX - 70, charY - 50, 40, 40);

		// Feet
		fill(0);
		rect(charX - 70, charY - 10, 10, 10);
		rect(charX - 40, charY - 10, 10, 10);

		// Eyes
		stroke(0);
		strokeWeight(4);
		point(charX - 60, charY - 84);
		point(charX - 44, charY - 84);

		// Mouth
		fill(0);
		stroke(0);
		strokeWeight(5);
		point(charX - 50, charY - 70);
	}

	// Standing front facing character
	else
	{
		// Head
		fill(196, 164, 132);
		ellipse(charX - 40, charY - 80, 40, 40);

		// Hands
		fill(255, 0, 0);
		rect(charX - 70, charY - 60, 60, 20);

		// Body
		rect(charX - 60, charY - 50, 40, 40);

		// Feet
		fill(0);
		rect(charX - 60, charY - 10, 10, 10);
		rect(charX - 30, charY - 10, 10, 10);

		// Eyes
		stroke(0);
		strokeWeight(4);
		point(charX - 49, charY - 82);
		point(charX - 34, charY - 82);

		// Draw a smile
		noFill();
		stroke(0);
		strokeWeight(1);
		arc(charX - 41, charY - 72, 16, 10, 0, PI);
	}
	// Revert to settings as they were
	pop();
    
	/////////// GAME INTERACTION ///////////

	/* The conditional statements are based on the given instructions from the previous projects. 
	I just added a text using the new functions I've learned in the lectures or Sleuth, such as `textAlign()`, 
	to let the user know whenever the game is over. (i.e. the character falls or plummets) */

	if (isLeft)
	{
		charX -= 6; // Moving to the left
	}

	if (isRight)
	{
		charX += 6; // Moving to the right
	}

	if (charY < floorPos_y)
	{
		charY += 10; // Make the game character fall down to the ground
		isFalling = true;
	}

	else
	{
		isFalling = false; // Stop the falling when the character touches the ground
	}

	// Detect when the character is over the canyon
	if (
		charX > canyonXPos &&
		charX < canyonXPos + canyon.width &&
		charY >= floorPos_y
	)
	{
		isPlummeting = true;
		
		// Game over whenever the character plummets
		fill(255);
		stroke(0);
		strokeWeight(3);
		textFont('Courier New');
		textSize(32);
		textAlign(CENTER, CENTER);
		text('You Lost the Game!', 520, 110);
	}

	else
	{
		isPlummeting = false;
	}

	if (isPlummeting)
	{
		charY += 10; // Make the game character falls more quickly
	}
}

/////////// Animation Controls ///////////

/* The code for the animation controls is written on my own and based on the given instructions. */

function keyPressed()
{
	// Freeze the controls so that the character can no longer be moved once plummeting

	if (keyCode == 37 && !isPlummeting) //ArrowLeft
	{
		isLeft = true;
	}

	else if (keyCode == 39 && !isPlummeting) //ArrowRight
	{
		isRight = true;
	}
      
	if (keyCode == 32 && !isPlummeting && !isFalling) // Prevent the character from double-jumping
	{
		charY -= 150;
	}
}

function keyReleased()
{
	if (keyCode == 37) //ArrowLeft
	{
		isLeft = false;
	}
	
	else if (keyCode == 39) //ArrowRight
	{
		isRight = false;
	}
}