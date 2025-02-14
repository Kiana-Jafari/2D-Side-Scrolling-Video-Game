// Declare global variables

let charX;
let charY;
let floorPos_y;

let isLeft;
let isRight;
let isFalling;
let isPlummeting;
let isFound;

let canyons;
let collectables;

let treesX;
let treesY;

let cactus;
let warning;

let mountainsX;
let mountainsY;

let sun;
let firstCloud;
let secondCloud;

let gameScore;
let key;
let flagpole
let lives;

let cameraX = 0;

let backgroundSound;
let winSound;
let gameLost;
let coinSound;
let fallingSound;
let jumpSound;

// Load the key and sounds here
function preload()
{
	// Load the key image
	//key = loadImage('key.png');

	soundFormats('mp3','wav');

	// Background Sound
	backgroundSound = loadSound('assets/background.wav');
	backgroundSound.setVolume(0.1);

	// Winning Sound
	winSound = loadSound('assets/winning.wav');
	winSound.setVolume(0.3);

	// Game Lost Sound
	gameLost = loadSound('assets/lose.wav');
	gameLost.setVolume(0.1);

	// Collectables Sound
	coinSound = loadSound('assets/collectables.wav');
	coinSound.setVolume(0.2);

	// Falling Sound
	fallingSound = loadSound('assets/falling.mp3');
	fallingSound.setVolume(0.1);

	// Jumping Sound
	jumpSound = loadSound('assets/jump.wav');
	jumpSound.setVolume(0.2);

}

function setup()
{
	// Prepare the canvas for drawing
	createCanvas(1024, 576);
	floorPos_y = height * 3 / 4;
	lives = 3;
	
	// Start the game
	startGame();
	
	// Play the game sound whenever the game has been started
	backgroundSound.play();
	
}

function draw()
{
	// Update relative position dynamically
	cameraX = charX - width / 2;

	background(0, 255, 155); // Fill the sky blue
	noStroke();
      
	// Draw the green ground
	fill(0, 150, 0);
	rect(
		0, 
		floorPos_y, 
		width, 
		height - floorPos_y);

	// Implement scrolling
	push();
	translate(-cameraX * 0.8, 0)

	/////////// GAME SCENERY ///////////
	
	// Canyons
	for (let i = 0; i < canyons.length; i++)
	{
		drawCanyon(canyons[i]);
		checkCanyon(canyons[i]);
	}

	// Mountains
	drawMountains();

	// Warning Sign
	drawSign(warning);

	// Collectables
	for (let i = 0; i < collectables.length; i++)
	{
		if (!collectables[i].isFound)
		{
			drawCollectable(collectables[i]);
			checkCollectable(collectables[i]);
		}
	}

	// Trees
	drawTrees();

	// Saguaro Cactus
	drawCactus(cactus);

	// Sun
	drawSun();

	// Clouds
	drawClouds();

	// flagpole
	drawFlagpole();
	if (flagpole.isReached == false)
	{
		checkFlagpole();
	}

	// Lives
	checkPlayerDie();

	/////////// GAME CHARACTER ///////////

	drawGameCharacter();

	// Revert to settings as they were
	pop();

	// Score
	fill(0);
	noStroke();
	textFont('Melissa');
	textSize(20);
	text('Score: ' + gameScore, 15, 25);

	// Draw life tokens onto the screen
	fill(0);
	noStroke();
	textFont('Melissa');
	textSize(20);
	text('Lives: ' + lives, 15, 45);

	// Game is over if `lives` is lees than 1
	if (lives < 1)
	{
		backgroundSound.stop();
		gameOver();
	}

	// Level is completed when the flagpole has been reached
	if (flagpole.isReached == true)
	{
		backgroundSound.stop();

		fill(255);
		stroke(0);
		strokeWeight(3);
		textFont('Courier New');
		textSize(32);
		textAlign(CENTER, CENTER);
		text('Level Completed!', 520, 110);
		noStroke();
	}
    
	/////////// GAME INTERACTION ///////////

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
		charY += 6; // Make the game character fall down to the ground
		isFalling = true;
	}

	else
	{
		isFalling = false; // Stop falling when the character touches the ground
	}
}

/////////// Animation Controls ///////////

function keyPressed()
{
	// Freeze the controls so that the character can no longer be moved once plummeting

	if (!isPlummeting && !flagpole.isReached == true && !lives < 1)
	{
		if (keyCode == 37)
		{
			isLeft = true;
		}

		else if (keyCode == 39)
		{
			isRight = true;
		}

		if (keyCode == 32 && !isFalling)
		{
			charY -= 180;
			isFalling = true;
			jumpSound.play();
		}
	}

	else
	{
		return ;
	}
}

function keyReleased()
{
	if (keyCode == 37) // ArrowLeft
	{
		isLeft = false;
	}
	
	else if (keyCode == 39) // ArrowRight
	{
		isRight = false;
	}

	if (keyCode == 32) // Jumping
	{
		isFalling = true;
	}

}

function drawClouds()
{
	// Clouds
	for (let i = 0; i < firstCloud.length; i++)
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
}

function drawMountains()
{
	// Mountains
	for (let i = 0; i < mountainsX.length; i++)
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
}

function drawSign(t_warning)
{
	// Warning Sign
	fill(255);
	stroke(255, 0, 0);
	strokeWeight(7);
	beginShape();
		vertex(t_warning.x, t_warning.y);
		vertex(t_warning.x + 30, t_warning.y - 55);
		vertex(t_warning.x + 60, t_warning.y);
	endShape(CLOSE);

	noStroke();
	fill(88, 57, 39);
	rect(t_warning.x + 25, t_warning.y + 3, 10, 40);

	fill(0);
	textFont('Courier New');
	textSize(46);
	textAlign(CENTER, CENTER);
	text('!', t_warning.x + 30, t_warning.y - 19);
}

function drawTrees()
{
	// Trees
	for (let i = 0; i < treesX.length; i++)
	{
		// Roots
		fill(150, 45, 0);
		rect(treesX[i] - 180, treesY + 44, 25, 100);
	
		// Leaves
		fill(35, 101, 51);
		ellipse(
			treesX[i] - 173, treesY - 10,
			treesY - 100, treesY - 100);
	}
}

function drawCactus(t_cactus)
{
	// Saguaro Cactus
	for (let i = 0; i < t_cactus.length; i++)
	{
		fill(34, 139, 34);
		rect(
			t_cactus[i].x, t_cactus[i].y, 
			t_cactus[i].w, t_cactus[i].h, 
			t_cactus[i].radius1, t_cactus[i].radius2, 
			t_cactus[i].radius3, t_cactus[i].radius4);
	}
}

function drawSun()
{
	// Sun
	fill(255, 255, 0);
	ellipse(sun.x, sun.y, sun.width, sun.height);
}

function drawCollectable(t_collectable)
{
	// Collectable
	if (!t_collectable.isFound)
	{
		fill(255, 255, 0);
		stroke(139, 128, 0);
		strokeWeight(3);
		ellipse(
			t_collectable.x_pos, t_collectable.y_pos,
			t_collectable.size, t_collectable.size);
			
		fill(0);
		stroke(0);
		strokeWeight(1);
		textSize(20);
		textAlign(CENTER, CENTER);
		text('1', t_collectable.x_pos, t_collectable.y_pos);
		noStroke();
	}
}

function checkCollectable(t_collectable)
{
	if (dist(charX, charY, t_collectable.x_pos, floorPos_y) < 30)
	{
		t_collectable.isFound = true;
		gameScore ++;
		coinSound.play();
	}
}

function drawCanyon(t_canyon)
{
	// Canyon
	fill(99, 94, 45);
	rect(
		t_canyon.x_Pos - 10, 
		432, 
		t_canyon.width + 17, 
		400);
}

function checkCanyon(t_canyon)
{
	// Detect when the character is over the canyon
	if (
		charY >= floorPos_y &&
		charX > t_canyon.x_Pos + 20 &&
		charX < t_canyon.x_Pos + t_canyon.width + 10
	)
	{
		isPlummeting = true;
	}

	else
	{
		isPlummeting = false;
	}

	if (isPlummeting)
	{
		charY += 10; // Make the game character falls more quickly
		isFalling = true;
		fallingSound.play();
	}
}

function drawFlagpole()
{
	push();
	strokeWeight(5);
	stroke(255);
	line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
	fill(0, 0, 255);
	noStroke();
	
	if (flagpole.isReached)
	{
		rect(flagpole.x_pos, floorPos_y - 250, 50, 50);
	}

	else
	{
		rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
	}
	pop();
}

function checkFlagpole()
{
	// Check if the player won the game
	const dist = abs(charX - flagpole.x_pos);

	if (dist < 15)
	{
		flagpole.isReached = true;
		winSound.play();
	}
}

function checkPlayerDie()
{
	// Decrease lives whenever the player loses the game
	if (charY >= height)
	{
		lives --;
		startGame();
	}
}

function gameOver()
{
	fill(255);
	stroke(0);
	strokeWeight(3);
	textFont('Courier New');
	textSize(32);
	textAlign(CENTER, CENTER);
	text('Game Over! Refresh to start the game.', 510, 110);
	noStroke();
}

function startGame()
{
	charX = width / 2;
	charY = floorPos_y;

    // Initialize the variables
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	canyons = [
		{x_Pos: 70, width: 100},
		{x_Pos: 600, width: 100},
		{x_Pos: 1200, width: 100}
	];
	
	collectables = [
		{x_pos: 240, y_pos: 330, size: 30, isFound: false},
		{x_pos: 850, y_pos: 330, size: 30, isFound: false},
		{x_pos: 1450, y_pos: 330, size: 30, isFound: false}
	];

	mountainsX = [100, 200, 860, 1050];
	mountainsY = floorPos_y;

	treesX = [65, 150, 700, 900, 1300, 1450];
	treesY = height / 2;

	cactus = [
		{x: 800, y: 370, w: 25, h: 62, radius1: 15, radius2: 15, radius3: 4, radius4: 4}, // Cactus main body
		{x: 770, y: 380, w: 20, h: 35, radius1: 15, radius2: 15, radius3: 0, radius4: 0},
		{x: 770, y: 405, w: 35, h: 15, radius1: 0, radius2: 0, radius3: 0, radius4: 25}, // Cactus left arm
		{x: 835, y: 375, w: 20, h: 35, radius1: 15, radius2: 15, radius3: 0, radius4: 0},
		{x: 820, y: 405, w: 35, h: 15, radius1: 0, radius2: 0, radius3: 25, radius4: 0} // Cactus right arm
	];

	warning = {x: 100, y: 390};
	
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

	sun = {x: 195, y: 40, width: 60, height: 60};

	flagpole = {x_pos : 1800, isReached : false};

	gameScore = 0;
}

function drawGameCharacter()
{
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
}