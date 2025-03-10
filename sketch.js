// Declare global variables

let gameCharX;
let gameCharY;
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
let warningSign;

let mountains;
let sun;
let clouds1;
let clouds2;

let extraLive;
let lives;
let gameScore;
let flagpole;
let platforms;
let enemies;

let platformsPositions;
let enemyPositions;

let cameraX = 0;

let backgroundSound;
let winSound;
let coinSound;
let bonusSound;
let fallingSound;
let jumpSound;

// Function to load the sound effects
function preload()
{
	soundFormats('mp3','wav');

	// Background Sound
	backgroundSound = loadSound('assets/background.wav');
	backgroundSound.setVolume(0.1);

	// Winning Sound
	winSound = loadSound('assets/winning.wav');
	winSound.setVolume(0.3);

	// Collectables Sound
	coinSound = loadSound('assets/collectables.wav');
	coinSound.setVolume(0.2);

	// Bonus Sound
	bonusSound = loadSound('assets/bonus.wav');
	bonusSound.setVolume(0.2);

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
	cameraX = gameCharX - width / 2;

	background(0, 155, 255); // Fill the sky blue
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
	translate(-cameraX, 0)

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
	drawSign(warningSign);

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

	// Enemies
	for (let i = 0; i < enemies.length; i++)
	{
		enemies[i].drawEnemy(60, 0, 45);

		const isContact = enemies[i].checkContact(gameCharX, gameCharY);

		// Reduce `lives` by one and restart the game, if the character is in contact with one of the enemies
		if (isContact)
		{
			if (lives > 0)
			{
				lives -= 1;
				startGame();
				break;
			}
		}
	}

	// Platforms
	for (let i = 0; i < platforms.length; i++)
	{
		platforms[i].draw();
	}

	// Extra live for the character
	grantExtraLives(extraLive);

	// Saguaro Cactus
	drawCactus(cactus);

	// Sun
	drawSun();

	// Clouds
	drawClouds();

	// Flagpole
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

	// Display the current score & life tokens onto the screen
	fill(0);
	textFont('Melissa');
	textSize(20);
	text('Score: ' + gameScore, 15, 25);
	text('Lives: ' + lives, 15, 45);

	// Stop the background sound and make the game over if `live` is less than 1
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
		gameCharX -= 6; // Moving to the left
	}

	if (isRight)
	{
		gameCharX += 6; // Moving to the right
	}

	if (gameCharY < floorPos_y)
	{
		let isContact = false;

		// Make the character stand on the platforms if it is in contact with them
		for (let i = 0; i < platforms.length; i++)
		{
			if (platforms[i].checkContact(gameCharX, gameCharY))
			{
				isContact = true;
				break;
			}
		}

		if (isContact == false)
		{
			gameCharY += 6; // Make the game character fall down to the ground
			isFalling = true;
		}
	}

	else
	{
		isFalling = false; // Stop falling when the character touches the ground
	}
}

/////////// Animation Controls ///////////

function keyPressed()
{
	// Once plummeting, freeze the controls so that the character can no longer move
	if (isPlummeting)
	{
		return ;
	}

	else if (!flagpole.isReached == true && !lives < 1)
	{
		if (keyCode == 37) // Arrow Left
		{
			isLeft = true;
		}

		if (keyCode == 39) // Arrow Right
		{
			isRight = true;
		}

		if (keyCode == 32 && !isFalling)
		{
			gameCharY -= 200;
			isFalling = true;
			jumpSound.play();
		}
	}
}

function keyReleased()
{
	if (keyCode == 37) // Arrow Left
	{
		isLeft = false;
	}
	
	else if (keyCode == 39) // Arrow Right
	{
		isRight = false;
	}

	if (keyCode == 32) // Jumping
	{
		isFalling = true;
	}
}

// Function to draw the clouds
function drawClouds() 
{
	// Draw clouds1
	for (let cloud of clouds1)
		{
			// Shadow
			fill(0, 0, 0, 50);
			ellipse(cloud.x, cloud.shadowY, cloud.size, cloud.size);

			// Cloud body
			fill(255);
			ellipse(cloud.x, cloud.cloudY, cloud.size, cloud.size);
		}
  
	// Draw clouds2
	for (let cloud of clouds2)
		{
			// Shadow
			fill(0, 0, 0, 50);
			ellipse(cloud.x, cloud.shadowY, cloud.size, cloud.size);
			
			// Cloud body
			fill(255);
			ellipse(cloud.x, cloud.cloudY, cloud.size, cloud.size);
		}
}

// Function to draw the mountains
function drawMountains() 
{
	for (let mountain of mountains) 
		{
			const leftBaseX = mountain.x_center - mountain.width / 2;
			const rightBaseX = mountain.x_center + mountain.width / 2;
			const peakY = mountain.baseY - mountain.height;
		
			// Draw mountain
	  		fill(200, 200, 200);
	  		triangle(
				leftBaseX, mountain.baseY,
				mountain.x_center, peakY,
				rightBaseX, mountain.baseY);
  
	  		// Draw shadow
	  		const shadowPeakY = mountain.baseY - mountain.height * 0.85; // 85% of mountain height
	  		const shadowPeakXOffset = 15; // Offset for shadow
	  
	  		fill(128, 128, 128, 100);
	  		triangle(
				leftBaseX, mountain.baseY,
				mountain.x_center + shadowPeakXOffset, shadowPeakY,
				rightBaseX, mountain.baseY);
		}
}

// Function to draw the warning sign
function drawSign(sign) 
{
	// Coordinates
	const leftX = sign.x;
	const rightX = sign.x + sign.width;
	const topY = sign.y - sign.height;
  
	// Draw triangular sign
	fill(255);
	stroke(255, 0, 0);
	strokeWeight(7);
	beginShape();
		vertex(leftX, sign.y);
		vertex(sign.x + sign.width / 2, topY); // Tip of the triangle
	  	vertex(rightX, sign.y);
	endShape(CLOSE);
  
	// Draw wooden pole
	noStroke();
	fill(88, 57, 39);
	rect(
		sign.x + sign.width / 2 - sign.poleWidth / 2, // Center the pole
		sign.y + 3, // Small vertical offset from base
		sign.poleWidth,
		sign.poleHeight);
  
	// Draw "!" text
	fill(0);
	textFont('Courier New');
	textSize(46);
	textAlign(CENTER, CENTER);
	text(
		'!',
		sign.x + sign.textOffsetX,
		sign.y + sign.textOffsetY);
}

// Function to draw the trees
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

// Function to draw the Saguaro Cactus
function drawCactus(t_cactus)
{
	// Draw the Cactus
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

// Function to draw the sun
function drawSun()
{
	// Sun
	fill(255, 255, 0);
	ellipse(sun.x, sun.y, sun.width, sun.height);
}

// Function to draw the collectable
function drawCollectable(t_collectable)
{
	// Draw the collectable if `isFound` is set to true
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

// Function to check and collect the collectables
function checkCollectable(t_collectable)
{
	if (dist(gameCharX, gameCharY, t_collectable.x_pos, floorPos_y) < 20)
	{
		t_collectable.isFound = true;
		gameScore ++;
		coinSound.play();
	}
}

// Function to draw the collectable
function drawCanyon(t_canyon)
{
	// Canyon
	fill(99, 94, 45);
	rect(
		t_canyon.x_Pos, 
		432, 
		t_canyon.width, 
		400);
}

// Function to check the character contact with canyons
function checkCanyon(t_canyon)
{
	// Detect when the character is over the canyon
	if (
		gameCharY >= floorPos_y &&
		gameCharX > t_canyon.x_Pos &&
		gameCharX < t_canyon.x_Pos + t_canyon.width
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
		gameCharY += 10; // Make the game character falls more quickly
		isFalling = true;
		fallingSound.play();
	}
}

// Function to draw the flagpole
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
		textSize(20);
		text('🏆', flagpole.x_pos + flagpole.flagSize / 2, floorPos_y - 222);
	}

	else
	{
		rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
	}
	pop();
}

// Function to check if the character reached the finish line
function checkFlagpole()
{
	const dist = abs(gameCharX - flagpole.x_pos);

	// Check the character contact with the flagpole
	if (dist < 15)
	{
		flagpole.isReached = true;
		winSound.play();
	}
}

// Function to grant extra lives for the character
function grantExtraLives(bonus)
{
	// Put extra live on the platforms
	if (!bonus.touched)
	{
		textSize(32);
		text(bonus.live, bonus.xPos, bonus.yPos);
	}
	
	if (!bonus.touched && dist(gameCharX, gameCharY, bonus.xPos, bonus.yPos) < 25)
	{
		bonus.touched = true;
		lives ++;
		bonusSound.play();
	}
}

// Function to check the game lost
function checkPlayerDie()
{
	// Decrease `lives` whenever the player loses the game and restart the game
	if (gameCharY >= height)
	{
		lives --;
		startGame();
	}
}

// Function to handle platforms interaction and drawing using factory patterns
function createPlatforms(x, y, length)
{
	const p = {
		x: x,
		y: y, 
		length: length, 

		// Method to draw the platform
		draw: function()
		{
			fill(63, 42, 20);
			rect(this.x, this.y, this.length, 20, 10, 10);
		},

		// Method to check the platform contact
		checkContact: function(gc_x, gc_y)
		{
			if (gc_x > this.x && gc_x < this.x + this.length)
			{
				const d = this.y - gc_y;

				if (d >= 0 && d < 5)
				{
					return true;
				}
			}
			
			return false;
		}
	}

	return p;
}

// Constructor function to handle the enemy interaction & rendering
function Enemy(x, y, range)
{
	this.x = x;
	this.y = y;
	this.range = range;

	this.currentX = x;
	this.value = 1;

	// Limited movement for the enemy
	this.update = function()
	{
		this.currentX += this.value;

		if (this.currentX >= this.x + this.range)
		{
			this.value = -1;
		}

		else if (this.currentX < this.x)
		{
			this.value = 1;
		}
	}

	// Method to draw the enemy
	this.drawEnemy = function(bodyHeight, neckHeight, radius)
	{
		this.update();

		const ny = this.y - bodyHeight - neckHeight - radius; // Neck Y

		// Neck
		stroke(102);
		line(this.currentX, this.y - bodyHeight, this.currentX, ny);
		line(this.currentX - 5, this.y - bodyHeight, this.currentX - 5, ny);
		line(this.currentX - 10, this.y - bodyHeight, this.currentX - 10, ny);

		// Antennae
		line(this.currentX - 10, ny, this.currentX - 19, ny - 13);
		line(this.currentX, ny, this.currentX + 15, ny - 39);
		line(this.currentX, ny + 15, this.currentX + 36, ny + 25);

		// Body
		noStroke();
		fill(102);
		ellipse(this.currentX - 5, this.y - 33, 33, 33);
		fill(0);
		rect(this.currentX - 35, this.y - bodyHeight, 60, bodyHeight - 33);
		fill(102);
		rect(this.currentX - 35, this.y - bodyHeight + 15, 60, 6);

		// Head
		fill(0);
		ellipse(this.currentX, ny + 15, radius, radius);
		
		// Eye
		fill(255);
		ellipse(this.currentX + 5, ny + 15, 14, 14);
		fill(0);
		ellipse(this.currentX + 5, ny + 15, 4, 4);
		fill(153);
		ellipse(this.currentX - 8, ny + 15, 5, 5);
		ellipse(this.currentX + 8, ny + 4, 4, 4);
		ellipse(this.currentX + 15, ny + 20, 3, 3);
	}

	// Method to check the enemy contact
	this.checkContact = function(gc_x, gc_y)
	{
		const distance = dist(gc_x, gc_y, this.currentX, this.y);

		if (distance < 25)
		{
			return true;
		}

		return false;
	}
}

// Function to display the game over message
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

// Function to initialize the variables and start the game
function startGame()
{
	gameCharX = width / 2;
	gameCharY = floorPos_y;

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
		{x_pos: -320, y_pos: 330, size: 30, isFound: false},
		{x_pos: 240, y_pos: 330, size: 30, isFound: false},
		{x_pos: 850, y_pos: 330, size: 30, isFound: false},
		{x_pos: 1450, y_pos: 330, size: 30, isFound: false}
	];

	mountains = [
		{
			x_center: 100,       // Mountain center point (X-axis)
			baseY: floorPos_y,   // Base Y-position (matches floor)
			width: 200,          // Total width of the mountain base
			height: 300          // Height from base to peak
		},
		{
			x_center: 200,
		  	baseY: floorPos_y,
		  	width: 200,
		  	height: 300
		},
		{
		  	x_center: 860,
		  	baseY: floorPos_y,
		  	width: 200,
		  	height: 300
		},
		{
			x_center: 1050,
		  	baseY: floorPos_y,
		  	width: 200,
		  	height: 300}
	  ];

	treesX = [-390, 60, 160, 550, 700, 900, 1300, 1450];
	treesY = height / 2;

	cactus = [
		{x: 800, y: 370, w: 25, h: 62, radius1: 15, radius2: 15, radius3: 4, radius4: 4}, // Cactus main body
		{x: 770, y: 380, w: 20, h: 35, radius1: 15, radius2: 15, radius3: 0, radius4: 0},
		{x: 770, y: 405, w: 35, h: 15, radius1: 0, radius2: 0, radius3: 0, radius4: 25}, // Cactus left arm
		{x: 835, y: 375, w: 20, h: 35, radius1: 15, radius2: 15, radius3: 0, radius4: 0},
		{x: 820, y: 405, w: 35, h: 15, radius1: 0, radius2: 0, radius3: 25, radius4: 0} // Cactus right arm
	];

	warningSign = {
		x: 100,           
		y: 390,           
		width: 60,        
		height: 55,       
		poleWidth: 10,    
		poleHeight: 40,   
		textOffsetX: 30,  
		textOffsetY: -19  
	};
	
	clouds1 = [
		{
			x: 165,            
			shadowY: 50,       
			cloudY: 40,
			size: 50
		},
		{
			x: 135,
			shadowY: 70,       
			cloudY: 60,       
			size: 50
		},
		{
			x: 200,
			shadowY: 70,
			cloudY: 60,
			size: 50
		},
		{
			x: 165,
			shadowY: 90,       
			cloudY: 80,        
			size: 50
		}
	];
	  
	clouds2 = [
		{
			x: 760,
			shadowY: 55,       
			cloudY: 45,        
			size: 50
		},
		{
			x: 730,
			shadowY: 80,       
			cloudY: 70,        
			size: 60
		},
		{
			x: 785,
			shadowY: 80,
			cloudY: 70,
			size: 60
		},
		{
			x: 760,
			shadowY: 100,      
			cloudY: 90,        
			size: 50
		}
	];

	sun = {x: 195, y: 40, width: 60, height: 60};

	flagpole = {
		x_pos: 1800,
		isReached: false,         
		flagSize: 50
	};

	extraLive = {live: '❤️', xPos: 632, yPos: 320, touched: false};

	platforms = [];
	platformsPositions = [1154, 552];

	for (let i = 0; i < platformsPositions.length; i++)
	{
		platforms.push(createPlatforms(platformsPositions[i], floorPos_y - 80, 180));
	}

	enemies = [];
	enemyPositions = [-140, -510, 940, 1500];

	for (let i = 0; i < enemyPositions.length; i++)
	{
		enemies.push(new Enemy(enemyPositions[i], floorPos_y + 17, 100));
	}

	gameScore = 0;
}

// Function to draw the game character rendering
function drawGameCharacter()
{
	// Jumping-left character
	if (isLeft && isFalling)
	{
		// Head
		fill(196, 164, 132);
		ellipse(gameCharX - 50, gameCharY - 75, 40, 40);
	
		// Hands
		fill(255, 0, 0);
		rect(gameCharX - 100, gameCharY - 50, 60, 20);
	
		// Body
		rect(gameCharX - 70, gameCharY - 50, 40, 40);
	
		// Feet
		fill(0);
		rect(gameCharX - 75, gameCharY - 10, 10, 10);
		rect(gameCharX - 45, gameCharY - 10, 10, 10);
	
		// Eyes
		stroke(0);
		strokeWeight(4);
		point(gameCharX - 60, gameCharY - 84);
	}
	
	// Jumping-right character
	else if (isRight && isFalling)
	{
		// Head
		fill(196, 164, 132);
		ellipse(gameCharX - 50, gameCharY - 80, 40, 40);
	
		// Hands
		fill(255, 0, 0);
		rect(gameCharX - 70, gameCharY - 55, 60, 20);

		// Body
		rect(gameCharX - 70, gameCharY - 50, 40, 40);

		// Feet
		fill(0);
		rect(gameCharX - 65, gameCharY - 10, 10, 10);
		rect(gameCharX - 35, gameCharY - 10, 10, 10);
	
		// Eyes
		stroke(0);
		strokeWeight(4);
		point(gameCharX - 40, gameCharY - 84);
	}
	
	// Walking left character
	else if (isLeft)
	{
		// Head
		fill(196, 164, 132);
		ellipse(gameCharX - 50, gameCharY - 80, 40, 40);
	
		// Hands
		fill(255, 0, 0);
		rect(gameCharX - 90, gameCharY - 60, 80, 20);
	
		// Body
		rect(gameCharX - 70, gameCharY - 50, 40, 40);
	
		// Feet
		fill(0);
		rect(gameCharX - 70, gameCharY - 10, 10, 10);
		rect(gameCharX - 40, gameCharY - 10, 10, 10);

		// Eyes
		stroke(0);
		strokeWeight(4);
		point(gameCharX - 60, gameCharY - 84);
	}
	
	// Walking right character
	else if (isRight)
	{
		// Head
		fill(196, 164, 132);
		ellipse(gameCharX - 50, gameCharY - 80, 40, 40);

		// Hands
		fill(255, 0, 0);
		rect(gameCharX - 90, gameCharY - 60, 80, 20);
	
		// Body
		rect(gameCharX - 70, gameCharY - 50, 40, 40);
	
		// Feet
		fill(0);
		rect(gameCharX - 70, gameCharY - 10, 10, 10);
		rect(gameCharX - 40, gameCharY - 10, 10, 10);
	
		// Eyes
		stroke(0);
		strokeWeight(4);
		point(gameCharX - 40, gameCharY - 84);
	}
	
	// Jumping facing forwards character
	else if (isFalling || isPlummeting)
	{
		// Head
		fill(196, 164, 132);
		ellipse(gameCharX - 50, gameCharY - 80, 40, 40);
	
		// Hands
		fill(255, 0, 0);
		rect(gameCharX - 90, gameCharY - 60, 80, 20);
	
		// Body
		rect(gameCharX - 70, gameCharY - 50, 40, 40);
	
		// Feet
		fill(0);
		rect(gameCharX - 70, gameCharY - 10, 10, 10);
		rect(gameCharX - 40, gameCharY - 10, 10, 10);
	
		// Eyes
		stroke(0);
		strokeWeight(4);
		point(gameCharX - 60, gameCharY - 84);
		point(gameCharX - 44, gameCharY - 84);
	
		// Mouth
		fill(0);
		stroke(0);
		strokeWeight(5);
		point(gameCharX - 50, gameCharY - 70);
	}
	
	// Standing front facing character
	else
	{
		// Head
		fill(196, 164, 132);
		ellipse(gameCharX - 40, gameCharY - 80, 40, 40);
	
		// Hands
		fill(255, 0, 0);
		rect(gameCharX - 70, gameCharY - 60, 60, 20);

		// Body
		rect(gameCharX - 60, gameCharY - 50, 40, 40);

		// Feet
		fill(0);
		rect(gameCharX - 60, gameCharY - 10, 10, 10);
		rect(gameCharX - 30, gameCharY - 10, 10, 10);
	
		// Eyes
		stroke(0);
		strokeWeight(4);
		point(gameCharX - 49, gameCharY - 82);
		point(gameCharX - 34, gameCharY - 82);
	
		// Draw a smile
		noFill();
		stroke(0);
		strokeWeight(1);
		arc(gameCharX - 41, gameCharY - 72, 16, 10, 0, PI);
	}
}