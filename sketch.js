// CS30 Major Project
// Al Rasid Mamun
// Jan 6, 2020

let gameSetup;
let setBoolean;
let objectTime; 
let countScore;
let keyLetter;
let images;
let sounds;
let strings;
let fonts;
let states;
let bulletList;
let map;
let player;
let viro;
let treant;
let coin = [];
let bullets = [];
let pMoveUp = [];
let pMoveDown = [];
let pMoveLeft = [];
let pMoveRight = [];
let eMoveLeft = [];
let eMoveRight = [];

const WIDTH = 900; 
const HEIGHT = 600; 


function preload() {
  loadAssets();
  loadSprite();
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  setObjects();
  newClasses();
  map.createEmpty2dArray();
}

function draw() {
  gameMode();
}

function loadAssets() {
  images = { 
    introBG: loadImage("assets/images/bg/intro_bg.jpg"),
    gameBG: loadImage("assets/images/bg/game_bg.jpg"),
    fightGround: loadImage("assets/images/bg/fight_ground.jpg"),

    cursor: loadImage("assets/images/items/cursor.png"),
    inGameCursor: loadImage("assets/images/items/target.png"),

    gameTitle: loadImage("assets/images/text/game_title.png"),
    newGameTitle: loadImage("assets/images/text/new_game.png"),
    guideTitle: loadImage("assets/images/text/guide_title.png"),
    buttonH: loadImage("assets/images/button/button_h.png"),
    buttonNH: loadImage("assets/images/button/button_nh.png"),

    viro: loadImage("assets/images/enemy/viro.png"),
    bullet: loadImage("assets/images/items/fire_ball.png"),
    boomerang: loadImage("assets/images/items/boomerang.png"),
    coin: loadImage("assets/images/items/coin.png"),
    coinBag: loadImage("assets/images/items/coins_bag.png"), 
    deadCounter: loadImage("assets/images/items/dead_counter.png"),
    potion: loadImage("assets/images/items/potionGreen.png"),
    
    grass: loadImage("assets/images/tiles/grass.png"),
    ground: loadImage("assets/images/tiles/ground.jpg"),
    stone: loadImage("assets/images/tiles/stone.png"),
    water: loadImage("assets/images/tiles/water.png"),
  }; 
  
  sounds = { 
    introSound: loadSound("assets/sounds/intro_music.wav"),
    bgSound: loadSound("assets/sounds/background_music.mp3"),
    coinSound: loadSound("assets/sounds/collet_coin.mp3"),
    shootSound: loadSound("assets/sounds/shoot_bullet.mp3"),
    gameOverSound: loadSound("assets/sounds/game_over.mp3")
  };
  
  strings = {
    tileLayout: loadStrings("assets/grid/forest.txt"),
  };
  
  fonts = {
    theStyle: loadFont("assets/font/Fruktur-Regular.ttf"),
  };
}

function loadSprite() {
  // Player
  for (let i=0; i<9; i++) { 
    pMoveUp[i] = loadImage("assets/images/players/up_"+i+".png");
    pMoveDown[i] = loadImage("assets/images/players/down_"+i+".png");
    pMoveLeft[i] = loadImage("assets/images/players/left_"+i+".png");
    pMoveRight[i] = loadImage("assets/images/players/right_"+i+".png");
  }

  // Enemy 
  for (let i = 0; i < 4; i++) {
    eMoveLeft[i] = loadImage("assets/images/enemy/left/walk_"+i+".png");
    eMoveRight[i] = loadImage("assets/images/enemy/right/walk_"+i+".png");
  }
}

function enemyState() {
  if (states.enemyState === "eLeft") {
    image(eMoveLeft[treant.index], treant.x, treant.y, treant.width, treant.height);
  }
  if (states.enemyState === "eRight") {
    image(eMoveRight[treant.index], treant.x, treant.y, treant.width, treant.height);
  }
}

function newClasses() {
  player = new Player(width/2, height/2, 100);
  treant = new Treant(random(width), random(height));
  viro = new viroEnemy(random(width), random(height));
  map = new Map();

}

function setObjects() {
  gameSetup = {
    cursorX: width/2, 
    cursorY: height/2, 
    cursorSize: 25,
    buttonX: width/2, 
    buttonY: height/2,
    buttonW: 400,
    buttonH: 200,
    counterImgX: 50, 
    counterImgY: 50,
    potionW: 30, 
    potionH: 60,
    coinBagW: 50,
    coinBagH: 65,
    killCounterSize: 60, 
  };

  states = {
    game: "toStart",
    spriteState: "pDown",
    enemyState: "eLeft",
    attack: " ",
    direction: " "
  };
  
  bulletList = new Array();
  bulletList[0] = "fireBall";
  bulletList[1] = "boomerang";
  
  setBoolean = {
    bulletInteract: false,
  };

  objectTime = {
    respawnBullet: 0,
    bulletTime: 400,
    respawnEnemy: 0,
    enemyTime: 2000,
    survivedTime: 0,
    addTimeSurvived: 1000
  };

  keyLetter = {
    W: 87,
    A: 65,
    S: 83,
    D: 68
  };

  countScore = {
    coins: 0,
    kills: 0,
    surviveTime: 0
  };

  // grid = {
  //   tilesHigh: strings.tileLayout.length,
  //   tilesWide: strings.tileLayout[0].length,
  // };
}

function gameMode() {
  imageMode(CORNER);
  if (states.game === "toStart") {
    background(images.introBG);
    displayButtonOptions();
    displayTitles();
    displayCursor();
  }
  
  if (states.game === "guide") {
    background(images.gameBG);
    gameGuide();
  }
  
  if (states.game === "bulletList") {
    background(images.gameBG);
    toStartGame();
    displayOptions();
    displayCursor();
  }
  
  if (states.game === "runGame") {
    generateMap();
    createPlayer();
    playerStates();
    createNewBullets();
    // makeEnemies();
    // enemyState();
    playerHealth();
    makeCoins();
    removeCoins(); 
    bulletCollideWithViro();
    bulletCollideWithTreant();
    removeBullet();
    bulletCollideWithTile();
    scoreCounterImages();
    updateScore();
    TimeSurvived();
    displayGameCursor();
  }
  
  if (states.game === "gameOver") {
    background(images.gameBG);
    gameOver();
    displayCursor();
  }
}

function mouseMoved() { // if mouse move, cursorX and cursorY to mouseX and mouseY
  noCursor();
  gameSetup.cursorX = mouseX;
  gameSetup.cursorY = mouseY;
}

function displayGameCursor() {
  image(images.inGameCursor, gameSetup.cursorX, gameSetup.cursorY, gameSetup.cursorSize, gameSetup.cursorSize);
}

function displayCursor() {
  image(images.cursor, gameSetup.cursorX, gameSetup.cursorY, gameSetup.cursorSize, gameSetup.cursorSize);
}

function displayTitles() { // Display all titles in game
  let titleX = width/2; 
  let titleY = height/5; 
  let titleW = 800; 
  let titleH = 250;
  let nSideW = 250; 
  let nSideH = 50;
  let gSideW = 180; 
  let gSideH = 50;

  imageMode(CENTER);
  image(images.gameTitle, titleX, titleY, titleW, titleH); // Game Title
  image(images.newGameTitle, gameSetup.buttonX, gameSetup.buttonY + 20, nSideW, nSideH); // New Game Title
  image(images.guideTitle, gameSetup.buttonX, gameSetup.buttonY + 150, gSideW, gSideH); // Guide Title

}

function gameGuide() { // Show guide, pressed esc to exit
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(30);
  text("VIROTTACK", width/2, height/2 - 80);
  text("Move Player Using WASD", width/2, height/2 - 40);
  text("Mouse to Aim", width/2, height/2);
  text("Left Mouse Button to Shoot", width/2, height/2 + 40);
  text("PRESS ESC TO EXIT!", width/2, height/2 + 80);
  if (keyIsPressed && keyCode === 27) {
    states.game = "toStart";
  }
}

function displayButtonOptions() { // Display buttons, if mouse pressed change state
  imageMode(CENTER);
  if (mouseX > width/2 - 180 && mouseX < width/2 + 210 &&
    mouseY > height/2 && mouseY < height/2 + 80) {
    image(images.buttonH, gameSetup.buttonX, gameSetup.buttonY + 20, gameSetup.buttonW, gameSetup.buttonH);
    if (mouseIsPressed) {
      states.game = "bulletList";
    }
  }
  else {
    image(images.buttonNH, gameSetup.buttonX, gameSetup.buttonY + 20, gameSetup.buttonW, gameSetup.buttonH);
  }
    
  if (mouseX > width/2 - 180 && mouseX < width/2 + 210 &&
    mouseY > height/2 + 125 && mouseY < height/2 + 200) {
    image(images.buttonH, gameSetup.buttonX, gameSetup.buttonY + 150, gameSetup.buttonW, gameSetup.buttonH);
    if (mouseIsPressed) {
      states.game = "guide";
    }
  }
  else {
    image(images.buttonNH, gameSetup.buttonX, gameSetup.buttonY + 150, gameSetup.buttonW, gameSetup.buttonH);
  }
}

function toStartGame() { // Draw text, if key pressed, game start
  textAlign(CENTER);
  fill(255);
  textSize(30);
  text("Select an Option", width/2, height/2 - 100);
  text("PRESS ENTER TO START!", width/2, height/2 + 120);
  if (keyIsPressed && keyCode === 13) {
    states.game = "runGame";
  } 
}

function displayOptions() { // Display bullet options, if clicked, set bullet to that value
  let bX = width/2; 
  let bY = height/2;
  let bSize = 50; 
  let rectSize = 100;

  // Show Option 1 - fire
  if (mouseX > bX - 150 && mouseX < bX - 50 && mouseY > bY - 50 && mouseY < bY + 50) {
    push();
    noFill();
    stroke(255, 255, 0);
    strokeWeight(6);
    rectMode(CENTER);
    rect(bX - 100, bY, rectSize, rectSize);
    imageMode(CENTER);
    image(images.bullet, bX - 100, bY, bSize*1.2, bSize*1.2);
    pop();
    if (mouseIsPressed) {
      states.attack = bulletList[0];
      fill(255, 0, 0);
      textSize(30);
      text("FIRE SELECTED!", width/2, height/2 + 180);
    }
  }

  else {
    push();
    noFill();
    stroke(225, 0, 0);
    strokeWeight(6);
    rectMode(CENTER);
    rect(bX - 100, bY, rectSize, rectSize);
    imageMode(CENTER);
    image(images.bullet, bX - 100, bY, bSize, bSize);
    pop();
  }

  // Show Option 2 - Boomerang
  if (mouseX > bX - 50 && mouseX < bX  + 150 && mouseY > bY - 50 && mouseY < bY + 50) {
    push();
    noFill();
    stroke(255, 255, 0);
    strokeWeight(6);
    rectMode(CENTER);
    rect(bX + 100, bY, rectSize, rectSize);
    imageMode(CENTER);
    image(images.boomerang, bX + 100, bY, bSize*1.5, bSize*1.5);
    pop();
    if (mouseIsPressed) {
      states.attack = bulletList[1];
      fill(255, 0, 0);
      textSize(30);
      text("BOOMERANG SELECTED!", width/2, height/2 + 180);
    }
  }

  else {
    push();
    noFill();
    stroke(225, 0, 0);
    strokeWeight(6);
    rectMode(CENTER);
    rect(bX + 100, bY, rectSize, rectSize);
    imageMode(CENTER);
    image(images.boomerang, bX + 100, bY, bSize*1.25, bSize*1.25);
    pop();
  }
}

// Apply the value of bulletList and make new bullet
function selectNewBullets() {
  if (states.attack === bulletList[0]) {
    bullets.push(new Fire(player.x, player.y));  
  }
  else {
    bullets.push(new Boomerang(player.x, player.y));  
  }
}

function generateMap() {
  map.makeTileMap(map.cols, map.rows);
}

// Get values from player class and use them in player
function createPlayer() {
  player.movePlayer();
  player.angleOfBullets(mouseY, mouseX);
  player.drawHealthBar();
  player.fillBar();
  player.collideWithTile();
}

function playerHealth() {
  if (player.health <= 0) {
    states.game = "gameOver";
  }
}

function playerStates() {
  if (states.spriteState === "pUp") {
    image(pMoveUp[player.index], player.x, player.y, player.width, player.height);
  }
  if (states.spriteState === "pDown") {
    image(pMoveDown[player.index], player.x, player.y, player.width, player.height);
  }
  if (states.spriteState === "pLeft") {
    image(pMoveLeft[player.index], player.x, player.y, player.width, player.height);
  }
  if (states.spriteState === "pRight") {
    image(pMoveRight[player.index], player.x, player.y, player.width, player.height);
  }
}

// Get values from bullet class and use them in bullets array
function createNewBullets() {
  for (let i=0; i<bullets.length; i++) {
    bullets[i].displayBullets();
    bullets[i].shootBullets();
    bullets[i].collideWithTile();
  }
}

// Make a new bullet, if mouse pressed and push it to array 
function mousePressed() {
  if (states.game === "runGame") {
    if (millis() > objectTime.respawnBullet + objectTime.bulletTime) {
      selectNewBullets();
      objectTime.respawnBullet = millis();
      sounds.shootSound.setVolume(0.5);
      sounds.shootSound.play();
      sounds.shootSound.playMode("restart");
    }
  }
}

// Delete bullet if at edge of screen 
function removeBullet() {
  for (let i = 0; i<bullets.length; i++) {
    if (bullets[i].x < 0 || bullets[i].x > width ||
        bullets[i].y < 0 || bullets[i].y > height) {
      bullets.splice(i, 1);
    }
  }
}

// Delete bullet if collide with not moveable tiles
function bulletCollideWithTile() {
  for (let i = 0; i<bullets.length; i++) {
    if (bullets[i].isMoveable === true) {
      bullets[i].update();  
    }
    else {
      bullets.splice(i, 1);
    }
  }
}

// Get Values from enemy class and use them
function makeEnemies() {
  // treant
  treant.move();
  treant.teleport();
  treant.interactWithPlayer();
  treant.drawHealthBar();
  treant.fillBar();
  // Viro
  viro.displayEnemy();
  viro.updatePosition();
  viro.bounceEnemy();
  viro.interactWithPlayer();
  viro.drawHealthBar();
  viro.fillBar();
}


// Check if bullet and enemy collide, if true, delete bullet and enemy that collided
function bulletCollideWithViro() {
  for (let b=0; b<bullets.length; b++) {
    setBoolean.bulletInteract = collideRectRect(viro.x, viro.y, viro.size, viro.size,
      bullets[b].x, bullets[b].y, bullets[b].radius, bullets[b].radius);
    if (setBoolean.bulletInteract === true) {
      bullets.splice(b, 1);
      viro.health -= 50;
      if (viro.health <= 0) {
        coin.push(new Coins(viro.x, viro.y));
        countScore.kills += 1;
        viro = new viroEnemy(random(width), random(height));
      }
    } 
  }
}

// Check if bullet and enemy collide, if true, delete bullet and enemy that collided
function bulletCollideWithTreant() {
  for (let b=0; b<bullets.length; b++) {
    setBoolean.bulletInteract = collideRectRect(treant.x, treant.y, treant.width, treant.height,
      bullets[b].x, bullets[b].y, bullets[b].radius, bullets[b].radius);
    if (setBoolean.bulletInteract === true) {
      bullets.splice(b, 1);
      treant.health -= 50;
      if (treant.health <= 0) {
        countScore.kills += 1;
        treant = new Treant(random(width), random(height));
      }
    } 
  }
}

function makeCoins() {
  for (let i=0; i<coin.length; i++) {
    coin[i].display();
    coin[i].collisionWithPlayer();
  }
}

function removeCoins() {
  for (let i=0; i<coin.length; i++) { 
    if (coin[i].interact === true) {
      coin.splice(i, 1);
      countScore.coins += floor(random(3, 6));
    }
  }
}

function scoreCounterImages() {
  image(images.coinBag, gameSetup.counterImgX, gameSetup.counterImgY, gameSetup.coinBagW, gameSetup.coinBagH);
  image(images.deadCounter, gameSetup.counterImgX, gameSetup.counterImgY+70, gameSetup.killCounterSize, gameSetup.killCounterSize);
  
}

function updateScore() {
  fill(255);
  textSize(40);
  textFont(fonts.theStyle);
  text(countScore.coins, gameSetup.counterImgX+80, gameSetup.counterImgY+45);
  text(countScore.kills, gameSetup.counterImgX+80, gameSetup.counterImgY+110);
}

function TimeSurvived() {
  if (millis() > objectTime.survivedTime + objectTime.addTimeSurvived) {
    countScore.surviveTime += 1;
    objectTime.survivedTime = millis();
  }
}

function gameOver() {
  fill(255);
  textSize(40);
  text("Game Over! You Survived " + countScore.surviveTime + " Seconds", width/2, height/2-80);
  text(countScore.coins + " Coins Collected", width/2, height/2);
  text(countScore.kills + " Enemies Killed", width/2, height/2 + 80);
  text("PRESS SPACE TO RESTART!", width/2, height/2 + 150);
  if (keyIsPressed && keyCode === 32) {
    states.game = "toStart";
    countScore.coins = 0;
    countScore.kills = 0;
    player.health = 100;
    player = new Player(width/2, height/2, 100);
    treant = new Treant(random(width), random(height), 100);
    coin = [];
  } 
}

class Player {
  constructor(x, y, health) {
    this.x = x; 
    this.y = y;
    this.dX = 18;
    this.dY = 18; 
    this.width = 30;
    this.height = 45;
    this.barWidth = 50; 
    this.barHeight = 10;
    this.aimAngle = 0;
    this.bulletDistance = 0;
    this.index = 0;
    this.health = health; 
    this.maxHealth = health;
    this.isWalkable = false;
  }
  
  // Calculate Distance from player postion to mouse postion
  angleOfBullets(mY, mX) {
    this.aimAngle = atan2(this.y - mY,this.x - mX);
    this.bulletDistance = -10;
  }

  // Move using WASD && can not go off screen
  // Check if the path is walkable or not
  movePlayer() { 
    if (keyIsDown(keyLetter.W) && this.y > 0 &&  frameCount % 10 === 0) {
      states.spriteState = "pUp";
      states.direction = "up";
      if (this.isWalkable) {
        this.index = (this.index + 1) % pMoveUp.length;
        this.y -= this.dY;
      }
    } 
    else if (keyIsDown(keyLetter.S) && this.y < height - this.height && frameCount % 10 === 0) {
      states.spriteState = "pDown";
      states.direction = "down";
      if (this.isWalkable) {
        this.index = (this.index + 1) % pMoveDown.length;
        this.y += this.dY;
      }
    }
    else if (keyIsDown(keyLetter.D) && this.x < width - this.width && frameCount % 10 === 0) {
      states.spriteState = "pRight";
      states.direction = "right";
      if (this.isWalkable) {
        this.index = (this.index + 1) % pMoveRight.length;
        this.x += this.dX;
      }
    } 
    else if (keyIsDown(keyLetter.A) && this.x > 0 && frameCount % 10 === 0) {
      states.spriteState = "pLeft";
      states.direction = "left";
      if (this.isWalkable) {
        this.index = (this.index + 1) % pMoveLeft.length;
        this.x -= this.dX;
      }
    } 
  }
  
  // Check the tile if the tile is walkable
  collideWithTile() { 
    if (states.direction === "up") { // Top tile colision
      let gridX = floor((this.x + this.width/2)/map.width);
      let gridY = floor(this.y/map.height); 
      console.log(gridX, gridX);
      if (map.myMap[gridY][gridX] === "." || map.myMap[gridY][gridX] === "G") {
        this.isWalkable = true;
      }
      else {
        this.isWalkable = false;
      }
    }

    else if (states.direction === "down") { // Down tile colision
      let gridX = floor((this.x + this.width/2)/map.width);
      let gridY = floor((this.y + this.height)/map.height); 
      console.log(gridX, gridX);
      if (map.myMap[gridY][gridX] === "." || map.myMap[gridY][gridX] === "G") {
        this.isWalkable = true;
      }
      else {
        this.isWalkable = false;
      }
    }

    else if (states.direction === "left") { // Left tile colision
      let gridX = floor((this.x)/map.width);
      let gridY = floor((this.y + this.height/2)/map.height); 
      console.log(gridX, gridX);
      if (map.myMap[gridY][gridX] === "." || map.myMap[gridY][gridX] === "G") {
        this.isWalkable = true;
      }
      else {
        this.isWalkable = false;
      }
    }

    else if (states.direction === "right") { // Right tile colision
      let gridX = floor((this.x+this.width)/map.width);
      let gridY = floor((this.y + this.height/2)/map.height); 
      console.log(gridX, gridX);
      if (map.myMap[gridY][gridX] === "." || map.myMap[gridY][gridX] === "G") {
        this.isWalkable = true;
      }
      else {
        this.isWalkable = false;
      }
    }
  }

  // Draw outline of the Bar
  drawHealthBar() {
    stroke(2);
    strokeWeight(2);
    noFill();
    rect(this.x-8, this.y-14, this.barWidth, this.barHeight);
  }

  fillBar() {
    noStroke();
    fill(0,42,225);
    let drawWidth = this.health*this.barWidth / this.maxHealth;
    rect(this.x-8, this.y-14, drawWidth, this.barHeight);
  }
}

class Bullet {
  constructor(pX, pY) {
    this.x = pX; 
    this.y = pY; 
    this.dX = 0;
    this.dY = 0;
    this.angle = 0;
    this.isMoveable = false;
  }
  
  // Update x and y values with dx and dy
  update() {
    this.x += this.dX;
    this.y += this.dY;
  }
  
  // Use angle given by player, change the values of dx and dy
  shootBullets() {
    this.angle = player.aimAngle;
    this.dX = player.bulletDistance * cos(this.angle)*8;
    this.dY = player.bulletDistance * sin(this.angle)*8;
  }
  
  collideWithTile() {
    let gridX = floor(this.x/map.width);
    let gridY = floor(this.y/map.height); 
    if (map.myMap[gridY][gridX] === "." || map.myMap[gridY][gridX] === "G") {
      this.isMoveable = true;
    }
    else {
      this.isMoveable = false;
    }
  }
} 
  
// Extends of bullet class
class Fire extends Bullet {
  constructor(pX, pY) {
    super(pX, pY);
    this.radius = 12;
  }
  
  displayBullets() { 
    image(images.bullet, this.x, this.y, this.radius*2, this.radius*2);
  }
} 
  
// Extends of bullet class
class Boomerang extends Bullet {
  constructor(pX, pY) {
    super(pX, pY);
    this.radius = 15;
  }
  
  displayBullets() {
    image(images.boomerang, this.x, this.y, this.radius*2, this.radius*2);
  }
}

class Enemy {
  constructor(x, y, health) {
    this.x = x;
    this.y = y;
    this.barWidth = 50; 
    this.barHeight = 8;
    this.health = health;
    this.maxHealth = health;
    this.playerInteract = false;
  } 
}

class Treant extends Enemy {
  constructor(x, y) {
    super(x, y, 100);
    this.index = 0;
    this.width = 100;
    this.height = 120;
    this.dX = random(40, 60);
  }

  move() {
    if (frameCount % 15 === 0) {
      states.enemyState = "eRight";
      this.index = (this.index + 1) % eMoveRight.length;
      this.x += this.dX;
    }
  }

  teleport() {
    if (this.x+this.width > width) {
      this.x = 0;
      this.y = random(height);
    }
  }
  
  // Draw outline of the Bar
  drawHealthBar() {
    stroke(2);
    strokeWeight(2);
    noFill();
    rect(this.x+30, this.y, this.barWidth, this.barHeight);
  }
  
  fillBar() {
    noStroke();
    fill(225,25,25);
    let drawWidth = this.health*this.barWidth / this.maxHealth;
    rect(this.x+30, this.y, drawWidth, this.barHeight);
  }

  // Check if player collide with enemy, true, player health decrease one
  interactWithPlayer() {
    this.playerInteract = collideRectRect(this.x, this.y, this.width, this.height, player.x, player.y, player.width, player.height);
    if (this.playerInteract === true) {
      player.health -= 8;
    } 
  } 
}

class viroEnemy extends Enemy {
  constructor(x, y) {
    super(x, y, 100);
    this.size = 20;
    this.dX = random(3, 5); 
    this.dY = random(3, 5);
  }

  displayEnemy() {
    imageMode(CENTER);
    image(images.viro, this.x, this.y, this.size*2, this.size*2);
  }
    
  updatePosition() { // keep adding x through dx and y thorugh dy
    this.x += this.dX; 
    this.y += this.dY;
  }

  // Image Bounce at Edges, if needed so, doesn't go off screen
  bounceEnemy() {
    if (this.x > width - this.size || this.x < 0) {
      this.dX *= -1;
    } if (this.y > height - this.size || this.y < 0) {
      this.dY *= -1;
    }
  }

  // Draw outline of the Bar
  drawHealthBar() {
    stroke(2);
    strokeWeight(2);
    noFill();
    rect(this.x-28, this.y-30, this.barWidth, this.barHeight);
  }
    
  fillBar() {
    noStroke();
    fill(225,25,25);
    let drawWidth = this.health*this.barWidth / this.maxHealth;
    rect(this.x-28, this.y-30, drawWidth, this.barHeight);
  }
  
  // Check if player collide with enemy, true, player health decrease one
  interactWithPlayer() {
    this.playerInteract = collideRectRect(this.x, this.y, this.size, this.size, player.x, player.y, player.width, player.height);
    if (this.playerInteract === true) {
      player.health -= 4;
    } 
  } 
}

class Coins {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 50;
    this.interact = false;
  }
  display() {
    image(images.coin, this.x, this.y, this.radius, this.radius);
  }

  // Check if player collide with coins, true, add one to coin score
  collisionWithPlayer() {
    this.interact = collideRectRect(this.x, this.y, this.radius, this.radius, player.x, player.y, player.width, player.height);
    if (this.interact === true) {
      this.score += floor(random(3, 6));
      // sounds.coinSound.setVolume(0.5);
      // sounds.coinSound.play();
    } 
  } 
}

class Map {
  constructor() {
    this.myMap = strings.tileLayout;
    this.cols = this.myMap.length;
    this.rows = this.myMap[0].length-1;
    this.width = width/this.cols;
    this.height = height/this.rows;
  }

  makeTileMap(theCols, theRows) { // Make the tiles size according to the cols and rows, and use value of strings 
    for (let x = 0; x < theCols; x++) { 
      for (let y = 0; y < theRows; y++) {
        stroke(0);
        strokeWeight(2);
        rect(x * this.width, y * this.height, this.width, this.height);
        if (this.myMap[y][x] === "G") { // Ground Tile
          image(images.ground, x * this.width, y * this.height, this.width, this.height);
        }
        else if (this.myMap[y][x] === "S") { // Stone Tile
          image(images.stone, x * this.width, y * this.height, this.width, this.height);
        }
        else if (this.myMap[y][x] === "W") { // Wayer Tile
          image(images.water, x * this.width, y * this.height, this.width, this.height);
        }
        else if (this.myMap[y][x] === ".") { // Grass Tile
          image(images.grass, x * this.width, y * this.height, this.width, this.height);
        }
      }
    }
  }

  createEmpty2dArray() {
    let randomGrid = [];
    for (let x = 0; x < this.cols; x++) {
      randomGrid.push([]);
      for (let y = 0; y < this.rows; y++) {
        randomGrid[x].push(0);
      }
    }
    return randomGrid;
  }
}