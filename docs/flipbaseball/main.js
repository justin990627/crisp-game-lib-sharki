title = "BASEBALL";

description = `
[Tap] Swing
AVOID BOMB
`;

characters = [
  `
 yyy
yr ry 
y r y
yr ry
 yyy
`,
  `
  r
 lll
lllll
lllll
lllll
 lll
`,
`
  ll
  ll l
llllll
 llll
 l  l
`
];

let startTime;
let num = 1;
let rotate = 0;
let swinging = false;
let swingPos = {x:0, y:0}
let stunned;

options = {
  theme: 'shapeDark'
};


/**
 * @typedef {{
 * pos: Vector
 * }} Ball
 */

/**
* @type { Ball [] }
*/
let balls;

/**
* @type { number }
*/
let ballSpeed;

/**
* @type { number }
*/
let waveCount;

/**
 * @typedef {{
 * pos: Vector
 * }} Bomb
 */

/**
* @type { Bomb [] }
*/
let bombs;


const G = {
  BALL_MIN_BASE_SPEED: 1,
  BALL_MAX_BASE_SPEED: 1.5,
  WIDTH: 100,
  HEIGHT: 150
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function update() {
  if (!ticks) {
    balls = [];
    waveCount = 0;
    ballSpeed = 0;
    bombs = [];
    startTime = Date.now();
  }

  char('c', input.pos.x, input.pos.y);

  color("yellow");
  if (input.isJustPressed && !swinging && !stunned) {
    swinging = true;
  }

  if (input.isJustPressed && stunned)
  {
    play("select");
  }
  if (swinging) {
    play("laser"); //change the sound later
    bar(input.pos.x + 3, input.pos.y, 15, 2, (rotate + 30)*Math.PI/180, 0);
    rotate -= 8; //speed of swing
    if(rotate < -90) {
      swinging = false;
      rotate = 0;
    }
  }

  if (balls.length === 0) {
    ballSpeed =
      rnd(G.BALL_MIN_BASE_SPEED, G.BALL_MAX_BASE_SPEED) * difficulty;
    for (let i = 0; i < 9; i++) {
      const posX = rnd(0, G.WIDTH);
      const posY = -rnd(i * G.HEIGHT * 0.1);
      balls.push({ pos: vec(posX, posY) })
    }
  }
  remove(balls, (ba) => {
    ba.pos.y += ballSpeed;

    const collideWithBat = char("a", ba.pos).isColliding.rect.yellow;

    if(collideWithBat) {
      addScore(10, ba.pos);
    }

    return (collideWithBat || ba.pos.y > G.HEIGHT);
  });

  if (bombs.length === 0) {
    ballSpeed =
      rnd(G.BALL_MIN_BASE_SPEED, G.BALL_MAX_BASE_SPEED) * difficulty;
    for (let i = 0; i < 3; i++) {
      const posX = rnd(0, G.WIDTH);
      const posY = -rnd(i * G.HEIGHT * 0.1);
      bombs.push({ pos: vec(posX, posY) })
    }
  }
  remove(bombs, (bo) => {
    color("black");
    bo.pos.y += ballSpeed;
    char("b", bo.pos);

	const collideWithBat = char("b", bo.pos).isColliding.rect.yellow;

    if(collideWithBat) {
      color("red");
      particle(bo.pos);
      play("explosion");
      stunned = 1;
      sleep(3000).then(() => {; //3 seconds
      console.log("stunned!");
      stunned = 0;
    });

    
    }
  return (collideWithBat || bo.pos.y > G.HEIGHT);
  });

  color("light_black");
  text("Time Left:", 14, 10);
  num = Math.floor(61 - ((Date.now() - startTime) / 1000));
  //if score add 250, time add 5s
  while(score + 50){
    num += 5000;
  }
  if (num <= 0) {
    end();
  }
  text(num.toString(), 77, 10);
}