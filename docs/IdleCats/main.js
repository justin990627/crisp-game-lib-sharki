title = "Idle Cats";

description = `
	[TAP] 
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
 
`
];

const G = {
	WIDTH: 100,
	HEIGHT: 100
};

// Menu Constants
const M = {
	HOWTALL: 65,
	SPEEDMOVE: 2,
	MENUY: 65,
}

let pause_dir = 6;

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
	theme: 'shapeDark'
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

// Menu Functions
let menuMove = 0;

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
	}

	var addCat = false;

	// Clicking and not in menu
	if(input.isJustPressed && input.pos.y < M.MENUY)
	{
		addScore(1);
		catList.forEach((c) => {
			c.pos = vec(rnd(0,G.WIDTH), rnd(0,G.HEIGHT));
		});
		if(score%10==0){
			addCat = true;
		}
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

			// Tab Text
			color("white");
			text("Menu", 3, G.HEIGHT - 4 - menuMove/2);

			// Speed at which menu moves
			menuMove += M.SPEEDMOVE;
		}
		else{
			// Menu Box
			box(G.WIDTH/2, G.HEIGHT, G.WIDTH, M.HOWTALL);
			box(13, G.HEIGHT, 25, M.HOWTALL + 15 + 1); // +1 Varies on HOWTALL Constant (Weird)

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

			// Tab Text
			color("white");
			text("Menu", 3, G.HEIGHT - 4 - menuMove/2);

			// Speed at which menu moves
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
}
