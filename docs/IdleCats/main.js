title = "Idle Cats";

description = `
	[TAP] Action
`;

// Define pixel arts of characters.
// Each letter represents a pixel color.
// (l: black, r: red, g: green, b: blue
//  y: yellow, p: purple, c: cyan
//  L: light_black, R: light_red, G: light_green, B: light_blue
//  Y: light_yellow, P: light_purple, C: light_cyan)
// Characters are assigned from 'a'.
// 'char("a", 0, 0);' draws the character
// defined by the first element of the array.
characters = [
// a
`
 
l  l l
l  lll
 llll
  l l
	`
,
// b
`
l  l l
l  lll
 llll
  l l
`,
`
 ll l
l  l
 ll l
`,
`
l ll
 l  l
l ll
`,
`
l l
 l
l l
l l
 l
`,
`
 l
l l
l l
 l
l l
`
];

const G = {
	WIDTH: 100,
	HEIGHT: 100
};

// Menu Constants
const M = {
	HOWTALL: 100,
	SPEEDMOVE: 2,
	MENUY: 55,
}

let pause_dir = 6;
let cat = 1;
let income;
let timer;

const cat_frames = {
	0: 'a',
	1: 'b'
}

const cat_colors = {
	0: 'cyan',
	1: 'red',
	2: 'green',
	3: 'purple'
}

options = {
	theme: 'shapeDark',
	isReplayEnabled: true,
	isCapturing: true,
	isPlayingBgm: true,
	seed: 235,
	isShowingScore: true
};

/**
 * @typedef {{
 * pos: Vector,
 * frame: number,
 * frame_pause: number,
 * color: Color
 * }} Cat
 */

/**
 * @type { Cat [] }
 */
let catList = [];

/**
 * @type { Cat }
 */
let tempCat;

/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} RainOne
 */

/**
 * @type { RainOne [] }
 */
let rainingCatOne;

/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} RainTwo
 */

/**
 * @type { RainTwo [] }
 */
let rainingCatTwo;

/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} RainThree
 */

/**
 * @type { RainThree [] }
 */
let rainingCatThree;

/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} RainFour
 */

/**
 * @type { RainFour [] }
 */
let rainingCatFour;

// Menu Functions
let menuMove = 0;
let move = 112;

let addCat = false;

let endGame = 0;

// Amount per click
let lasers = 1;
let randomLaserX;
let randomLaserY;

// Price to buy Cats
let catBuyingButton = 50;

// Price to buy Lasers
let laserBuyingButton = 50;

// Price to buy ?
let questionButton = 10000;
let questionBought = false;
let questionDrop = 0.01;

tempCat = {
	pos: vec(G.WIDTH/2, G.HEIGHT/2),
	frame: 0,
	frame_pause: 0,
	color: 'cyan'
}

function update() {
	if (!ticks) {
		const xpos = G.WIDTH/2;
		const ypos = G.HEIGHT/2;
		var num = rnd(0,4);
		num = Math.floor(num);
		var catColor = cat_colors[num];
		tempCat = {
			pos: vec(xpos,ypos),
			frame: 0,
			frame_pause: 0,
			color: catColor
		}
		catList.push(tempCat);
		timer = Date.now();

		// Spawning fish background
		rainingCatOne = times(2, () => {
				  const posX = rnd(0, G.WIDTH);
				  const posY = rnd(0, G.HEIGHT);
				  return {
					  pos: vec(posX, posY),
					  speed: rnd(0.1, 0.3)
				  };
		})
		rainingCatTwo = times(2, () => {
				  const posX = rnd(0, G.WIDTH);
				  const posY = rnd(0, G.HEIGHT);
				  return {
					  pos: vec(posX, posY),
					  speed: rnd(0.1, 0.3)
				  };
		})
		rainingCatThree = times(2, () => {
				  const posX = rnd(0, G.WIDTH);
				  const posY = rnd(0, G.HEIGHT);
				  return {
					  pos: vec(posX, posY),
					  speed: rnd(0.1, 0.3)
				  };
		})
		rainingCatFour = times(2, () => {
				  const posX = rnd(0, G.WIDTH);
				  const posY = rnd(0, G.HEIGHT);
				  return {
					  pos: vec(posX, posY),
					  speed: rnd(0.1, 0.3)
				  };
		})

		endGame = 0;
		questionDrop = 0;
		questionBought = false;
		lasers = 1;
		cat = 1;
	}

	// Random fish background
	color("light_blue");
	rainingCatOne.forEach((rOne) => {
			rOne.pos.y += rOne.speed;
			if (rOne.pos.y > G.HEIGHT) rOne.pos.y = 0;
		
			char("c", rOne.pos);
	});
	rainingCatTwo.forEach((rTwo) => {
			rTwo.pos.y += rTwo.speed;
			if (rTwo.pos.y > G.HEIGHT) rTwo.pos.y = 0;
		
			char("d", rTwo.pos);
	});
	color("light_purple");
	rainingCatThree.forEach((rThree) => {
		rThree.pos.y += rThree.speed;
			if (rThree.pos.y > G.HEIGHT) rThree.pos.y = 0;
		
			char("e", rThree.pos);
	});
	rainingCatFour.forEach((rFour) => {
			rFour.pos.y += rFour.speed;
			if (rFour.pos.y > G.HEIGHT) rFour.pos.y = 0;
		
			char("f", rFour.pos);
	});

	income = cat * 1; //do income per second calculation here

	// Clicking and not in menu
	if(input.isJustPressed && input.pos.y < M.MENUY)
	{
		play("laser");
		// Spawning in laser
		randomLaserX = rndi(0, 200);
		if(randomLaserX >= 0 && randomLaserX <= 100){
			randomLaserX *= -1;
		}
		randomLaserY = rndi(0, 200);
		if(randomLaserY >= 0 && randomLaserY <= 100){
			randomLaserY *= -1;
		}
		color("red");
		line(randomLaserX,randomLaserY, input.pos.x, input.pos.y, 3);
		color("black");
		line(randomLaserX,randomLaserY, input.pos.x, input.pos.y, 1);

		addScore(lasers);
		catList.forEach((c) => {
			c.pos = vec(rnd(0,G.WIDTH), rnd(0,G.HEIGHT));
		});
	}

	// make new cat
	if(addCat) {
		const xpos = rnd(15,G.WIDTH-15);
		const ypos = rnd(15,G.HEIGHT-15);
		var num = rnd(0,4);
		num = Math.floor(num);
		console.log(num);
		var catColor = cat_colors[num];
		tempCat = {
			pos: vec(xpos,ypos),
			frame: 0,
			frame_pause: 0,
			color: catColor
		}
		catList.push(tempCat);
		cat++;
		addCat = false;
	}

	catList.forEach((c,i) => {
		if(c.frame_pause <= 0){
			c.frame += 1;
			if(c.frame > 1){
				c.frame = 0;
			}
			c.frame_pause = pause_dir;
		}
		c.frame_pause -= 1;
		color(c.color);
		char(cat_frames[c.frame],c.pos);
	});

	// Menu Update
	if(input.pos.y > M.MENUY){
		color("light_cyan");
		if(menuMove < M.HOWTALL){
			// Menu Box
			box(G.WIDTH/2, G.HEIGHT, G.WIDTH, menuMove);
			box(13, G.HEIGHT, 25, menuMove + 15);

			// Cat Buying Button
			color("light_black")
			box(13, move, 20, 12);
			color("green");
			text("$" + catBuyingButton.toString(), 27, move);
			color("light_cyan");
			char("a", 7, move);
			text("+1", 13, move);

			// Laser Buying Button
			color("light_black");
			box(67, move, 20, 12);
			color("green");
			text("$" + laserBuyingButton.toString(), 82, move);
			color("red");
			line(63, move -3, 60, move + 4, 1);
			text("+1", 67, move);

			// ? Button
			color("yellow");
			box(G.WIDTH/2, move + 25, 40, 25);
			color("white");
			text("?", G.WIDTH/2, move+ 20);
			color("white");
			text("$" + questionButton.toString(), G.WIDTH/2 - 16, move + 30);

			// Tab Text
			color("white");
			text("Menu", 3, G.HEIGHT - 4 - menuMove/2);

			// Speed at which menu moves
			move -= 1
			menuMove += M.SPEEDMOVE;
		}
		else{
			// Menu Box
			box(G.WIDTH/2, G.HEIGHT, G.WIDTH, M.HOWTALL);
			box(13, G.HEIGHT, 25, M.HOWTALL + 15 + 1); // +1 Varies on HOWTALL Constant (Weird)
			
			// Cat Buying Button
			color("light_black")
			box(13, move, 20, 12);
			color("green");
			text("$" + catBuyingButton.toString(), 27, move);
			color("light_cyan");
			char("a", 7, move);
			text("+1", 13, move);

			// Laser Buying Button
			color("light_black");
			box(67, move, 20, 12);
			color("green");
			text("$" + laserBuyingButton.toString(), 82, move);
			color("red");
			line(63, move -3, 60, move + 4, 1);
			text("+1", 67, move);

			// ? Button
			color("yellow");
			box(G.WIDTH/2, move + 25, 40, 25);
			color("white");
			text("?", G.WIDTH/2, move+ 20);
			color("white");
			text("$" + questionButton.toString(), G.WIDTH/2 - 16, move + 30);

			// Tab Text
			color("white");
			text("Menu", 3, G.HEIGHT - 4 - M.HOWTALL/2);
		}
	}
	else{
		color("light_cyan");
		if(menuMove > 0){
			// Menu Box
			box(G.WIDTH/2, G.HEIGHT, G.WIDTH, menuMove);
			box(13, G.HEIGHT, 25, menuMove + 15);

			// Cat Buying Button
			color("light_black")
			box(13, move, 20, 12);
			color("green");
			text("$" + catBuyingButton.toString(), 27, move);
			color("light_cyan");
			char("a", 7, move);
			text("+1", 13, move);

			// Laser Buying Button
			color("light_black");
			box(67, move, 20, 12);
			color("green");
			text("$" + laserBuyingButton.toString(), 82, move);
			color("red");
			line(63, move -3, 60, move + 4, 1);
			text("+1", 67, move);


			// ? Button
			color("yellow");
			box(G.WIDTH/2, move + 25, 40, 25);
			color("white");
			text("?", G.WIDTH/2, move+ 20);
			color("white");
			text("$" + questionButton.toString(), G.WIDTH/2 - 16, move + 30);

			// Tab Text
			color("white");
			text("Menu", 3, G.HEIGHT - 4 - menuMove/2);

			// Speed at which menu moves
			move += 1
			menuMove -= M.SPEEDMOVE;
		}
		else{
			// Menu Tab
			color("light_cyan");
			box(13, G.HEIGHT, 25, 15);
			
			// Tab Text
			color("white");
			text("Menu", 3, G.HEIGHT - 4);
		}
	}
	
	//Red box that follows mouse 
	color("red");
	rect(input.pos.x, input.pos.y, 1, 1);

	// Buying Cats Button
	if(input.isJustPressed && input.pos.x <= 23 && input.pos.x >= 3 && input.pos.y <= move + 6 && input.pos.y >= move - 6){
		if(score >= catBuyingButton){
			play("coin");
			addCat = true;
			addScore(-catBuyingButton);
			catBuyingButton = Math.floor(catBuyingButton * 1.2);
		}
	}

	// Buying Lasers Button
	if(input.isJustPressed && input.pos.x <= 77 && input.pos.x >= 57 && input.pos.y <= move + 6 && input.pos.y >= move - 6){
		if(score >= laserBuyingButton){
			play("coin");
			lasers++;
			addScore(-laserBuyingButton);
			laserBuyingButton = Math.floor(laserBuyingButton * 1.1);
		}
	}

	// Buying ? Button box(G.WIDTH/2, move + 25, 40, 25);
	if(input.isJustPressed && input.pos.x <= 70 && input.pos.x >= 30 && input.pos.y <= move + 37 && input.pos.y >= move + 13){
		if(score >= questionButton){
			play("coin");
			questionBought = true;
			addScore(-questionButton);
		}
	}

	//draws the income per second text
	color("green");
	var str = "+" + income + "/s";
	text(str, 3, 9);
	//add income every 1000 ms(1 second)
	if(Date.now() - timer > 1000) {
		addScore(income);
		timer = Date.now();
	}


	color("yellow");
	box(87, -60 + questionDrop, 15, 15);
	box(57, -60 + questionDrop, 15, 15);
	box(12, -60 + questionDrop, 15, 15);

	box(87, -45 + questionDrop, 15, 15);
	box(72, -45 + questionDrop, 15, 15);
	box(57, -45 + questionDrop, 15, 15);
	box(12, -45 + questionDrop, 15, 15);

	box(72, -30 + questionDrop, 15, 15);
	box(57, -30 + questionDrop, 15, 15);
	box(42, -30 + questionDrop, 15, 15);
	box(27, -30 + questionDrop, 15, 15);

	box(72, -15 + questionDrop, 15, 15);
	box(42, -15 + questionDrop, 15, 15);

	color("white");
	box(87, -45 + questionDrop, 5, 5);
	box(57, -45 + questionDrop, 5, 5);

	if (questionBought && Date.now() - timer > 500 && questionDrop <= 90){
		questionDrop += 0.3;
	}

	if(questionDrop >= 90){
		endGame++;
		//particle(G.WIDTH/2, G.HEIGHT/2, 200, 2 ,0, 360);
		color("red");
		particle(87, -60 + questionDrop, 200, 2 ,0, 360);
		particle(57, -60 + questionDrop, 200, 2 ,0, 360);
		particle(12, -60 + questionDrop, 200, 2 ,0, 360);

		particle(87, -45 + questionDrop, 200, 2 ,0, 360);
		particle(72, -45 + questionDrop, 200, 2 ,0, 360);
		particle(57, -45 + questionDrop, 200, 2 ,0, 360);
		particle(12, -45 + questionDrop, 200, 2 ,0, 360);

		particle(72, -30 + questionDrop, 200, 2 ,0, 360);
		particle(57, -30 + questionDrop, 200, 2 ,0, 360);
		particle(42, -30 + questionDrop, 200, 2 ,0, 360);
		particle(27, -30 + questionDrop, 200, 2 ,0, 360);

		particle(72, -15 + questionDrop, 200, 2 ,0, 360);
		particle(42, -15 + questionDrop, 200, 2 ,0, 360);
	}

	if(endGame == 25){
		end();
	}
}
