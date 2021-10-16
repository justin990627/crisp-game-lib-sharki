// The title of the game to be displayed on the title screen
title  =  "Space War";

// The description, which is also displayed on the title screen
description  =  `
Destroy Enemies
Avoid Friendly Fire
`;

// The array of custom sprites
characters  = [
`
PPPP
 P
 Pllll
 Pllll
 P
PPPP
`,`
  rrrr
  rrrr
rrrpr
rrrpr
  rrrrç
  rrrr
`,`
  PPPP
    P
llllP
llllP
    P
  PPPP
`,
];

//set constant that can change view size of the game
const G = {
  WIDTH: 150,
  HEIGHT: 100,

  STAR_SPEED_MIN: 0.5,
	STAR_SPEED_MAX: 1.5,

  PLAYER_FIRE_RATE: 3,
  PLAYER_GUN_OFFSET: 3,

  FBULLET_SPEED: 2,

  ENEMY_MIN_BASE_SPEED: 1,
  ENEMY_MAX_BASE_SPEED: 1.5,

  FRIENDLY_MIN_BASE_SPEED: 1,
  FRIENDLY_MAX_BASE_SPEED: 1.5

};

// Game runtime options
// Refer to the official documentation for all available options
options  = {
  viewSize: {x: G.WIDTH, y:G.HEIGHT},
  seed: 29,
  isPlayingBgm: true,
  theme: "shapeDark",
  isReplayEnabled: true,

  isCapturing: true,
  isCapturingGameCanvasOnly: true,
  captureCanvasScale: 2
};

//create star background
/**
* @typedef {{
  * pos: Vector,
  * speed: number
  * }} Star
  */
  
  /**
  * @type  { Star [] }
  */
  let stars;

  //create player
  /**
* @typedef {{
  * pos: Vector,
  * firingCooldown: number,
  * isFiringLeft: boolean
  * }} Player
  */
  
  /**
   * @type { Player }
   */
  let player;

  //define friendly bullet
  /**
 * @typedef {{
 * pos: Vector
   * }} FBullet
   */
  
  /**
   * @type { FBullet [] }
   */
  let fBullets;

  /**
   * @typedef {{
   * pos: Vector,
   * }} Enemy
   */

  /**
   * @type { Enemy [] }
   */
     let enemies;

  /**
   * @typedef {{
   * pos: Vector,
   //* firingCooldown: number
   * }} Friendly
   */

  /**
   * @type { Friendly [] }
   */
     let friendly;

  /**
   * @type { number }
   */
  let currentEnemySpeed;

  /**
   * @type { number }
   */
  let waveCount;

// The game loop function
function  update() {
  //play("coin");
	// The init function running at startup
  if (!ticks) {
    // A CrispGameLib function
    // First argument (number): number of times to run the second argument
    // Second argument (function): a function that returns an object. This
    // object is then added to an array. This array will eventually be
    // returned as output of the times() function.
      stars = times(20, () => {
        // Random number generator function
        // rnd( min, max )
        const posX = rnd(0, G.WIDTH);
        const posY = rnd(0, G.HEIGHT);
        
        // An object of type Star with appropriate properties
        return {
          // Creates a Vector
            pos: vec(posX, posY),
            // More RNG
            speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX)
        };
    });
    player = {
      pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5),
      firingCooldown: G.PLAYER_FIRE_RATE,
      isFiringLeft: true
    };
    
    fBullets = [];
    enemies = [];
    friendly = [];
    waveCount = 0;
    currentEnemySpeed = 0;
	}

if (enemies.length === 0) {
  currentEnemySpeed =
      rnd(G.ENEMY_MIN_BASE_SPEED, G.ENEMY_MAX_BASE_SPEED) * difficulty;
  for (let i = 0; i < 6; i++) {
      const posX = rnd(i * G.HEIGHT * 0.1) + 150; //0, G.WIDTH
      const posY = rnd(0, G.HEIGHT); //i * G.HEIGHT * 0.1
      enemies.push({ pos: vec(posX, posY) })
  }
  waveCount++;
  //console.log(difficulty);
}

if (friendly.length === 0) {
  currentEnemySpeed =
      rnd(G.FRIENDLY_MIN_BASE_SPEED, G.FRIENDLY_MIN_BASE_SPEED_MAX_BASE_SPEED) * difficulty;
  for (let i = 0; i < 3; i++) {
      const posX = rnd(i * G.HEIGHT * 0.1) + 150; //0, G.WIDTH
      const posY = rnd(0, G.HEIGHT); //i * G.HEIGHT * 0.1
      friendly.push({ pos: vec(posX, posY) })
  }
  waveCount++;
  //console.log(difficulty);
}

  // Update for Star
  stars.forEach((s) => {
    // Move the star downwards
    s.pos.x -= s.speed;
    // Bring the star back to top once it's past the bottom of the screen
    s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);

    // Choose a color to draw
    color("light_black");
    // Draw the star as a square of size 1
    box(s.pos, 1);
  });

// Updating and drawing the player
player.pos = vec(input.pos.x, input.pos.y);
//set border to restrict moving out of sight
player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);
//Cooling down for the next shot
player.firingCooldown--;
//Time to fire the next shot
//console.log(player.firingCooldown);
if(input.isPressed){
  if(player.firingCooldown <= 0){
    // Get the side from which the bullet is fired
    const offset = (player.isFiringLeft)
    ? -G.PLAYER_GUN_OFFSET
    : G.PLAYER_GUN_OFFSET;
    //create bullet
    fBullets.push({
      pos: vec(player.pos.x + offset, player.pos.y)
    });
    //reset the firing cooldown
    player.firingCooldown = G.PLAYER_FIRE_RATE;
    // Switch the side of the firing gun by flipping the boolean value
    player.isFiringLeft = !player.isFiringLeft;

    //particle color
    color("green");
    //generate particles
    particle(
      player.pos.x + offset, //x coordinate
      player.pos.y, //y coordinate
      4, //The number of particles
      1, //the speed of particles
      270, //the emitting angle
      PI/2 //the emitting width
    );

    //console.log(player.isFiringLeft);
    //console.log(G.PLAYER_GUN_OFFSET);
  }
}
//color("cyan");
//black to show original color
color("black");
//box(player.pos, 4);
//create shape for player  to change shape make change in character
char("a",player.pos);

//updating and draw bullets
fBullets.forEach((fb) => {
  //move the bullet upward
  fb.pos.x += G.FBULLET_SPEED;
  //drawing
  color("green");
  box(fb.pos, 2);
});

  // Another update loop
  // This time, with remove()
  remove(enemies, (e) => {
    e.pos.x -= currentEnemySpeed; 
    color("black");
    const isCollidingWithFBullets =  char("b", e.pos).isColliding.rect.green; //collide with green rectangle bullet
    const isCollidingWithPlayer = char("b", e.pos).isColliding.char.a;
      if (isCollidingWithPlayer || e.pos.x < 0) {
        end();
        play("powerUp");
    }

    //check whether to make a small particle explosion at the position
    if(isCollidingWithFBullets){
      color("red");
      particle(e.pos);
      play("explosion");
      addScore(10 * waveCount, e.pos);
    }

    return (isCollidingWithFBullets || e.pos.x < 0);
  }
);

remove(friendly, (f) => {
  f.pos.x -= currentEnemySpeed; 
  color("black");
  const isCollidingWithFBullets =  char("c", f.pos).isColliding.rect.green; //collide with green rectangle bullet
  const isCollidingWithPlayer = char("c", f.pos).isColliding.char.a;
    if (isCollidingWithPlayer) {
      end();
      play("powerUp");
  }

  //check whether to make a small particle explosion at the position
  if(isCollidingWithFBullets){
    color("green");
    particle(f.pos);
    play("explosion");
    addScore(-20 * waveCount, f.pos);
  }
  if(f.pos.x < 0){
    addScore(10 * waveCount, f.pos);
  }

  return (isCollidingWithFBullets || f.pos.x < 0);
}
);

if(score < 0){
  end();
}
text(enemies.length.toString(), 3, 10);
remove(fBullets, (fb) => {
  color("green");
  const isCollidingWithEnemies = box(fb.pos, 2).isColliding.char.b;
  return (isCollidingWithEnemies || fb.pos.y < 0);
});
}
