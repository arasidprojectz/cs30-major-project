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
let states;
let bulletList;
let grid;
let player;
let enemy;
let coin = [];
let bullets = [];
let pMoveUp = [];
let pMoveDown = [];
let pMoveLeft = [];
let pMoveRight = [];

const WIDTH = 1050; 
const HEIGHT = 750;

function preload() {
  loadAssets();
  loadSprite();
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  setObjects();
  newClasses();
}

function draw() {
  gameMode();
}

function loadAssets() {
  images = { 
    introBG: loadImage("assets/images/bg/intro_bg.jpg"),
    gameBG: loadImage("assets/images/bg/game_bg.jpg"),

    cursor: loadImage("assets/images/items/cursor.png"),
    inGameCursor: loadImage("assets/images/items/target.png"),

    gameTitle: loadImage("assets/images/text/game_title.png"),
    newGameTitle: loadImage("assets/images/text/new_game.png"),
    guideTitle: loadImage("assets/images/text/guide_title.png"),
    buttonH: loadImage("assets/images/button/button_h.png"),
    buttonNH: loadImage("assets/images/button/button_nh.png"),

    enemy: loadImage("assets/images/enemy/enemy.png"),
    bullet: loadImage("assets/images/items/fire_ball.png"),
    boomerang: loadImage("assets/images/items/boomerang.png"),
    coin: loadImage("assets/images/items/coin.png"),
    coinBag: loadImage("assets/images/items/coins_bag.png"), 
    deadCounter: loadImage("assets/images/items/dead_counter.png"),
    
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
}

function loadSprite() {
  for (let i=0; i<9; i++) { //Idle
    pMoveUp[i] = loadImage("assets/images/players/up_"+i+".png");
    pMoveDown[i] = loadImage("assets/images/players/down_"+i+".png");
    pMoveLeft[i] = loadImage("assets/images/players/left_"+i+".png");
    pMoveRight[i] = loadImage("assets/images/players/right_"+i+".png");
  }
}

function newClasses() {
  player = new Player(width/2, height/2, 100);
  enemy = new Enemy(random(width), random(height), 100);
  grid = new Grid();
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
  };
  
  states = {
    game: "toStart",
    spriteState: "pDown",
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
}

function gameMode() {
  imageMode(CORNER);
  // if (states.game === "loadingScreen") {

  // }

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
    generateGrid();
    createPlayer();
    playerStates();
    createNewBullets();
    makeEnemies(); 
    playerHealth();
    makeCoins();
    removeCoins(); 
    bulletCollideWithEnemy();
    bulletCollideWithTile();
    removeBullet();
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

// Get values from player class and use them in player
function createPlayer() {
  player.movePlayer();
  player.angleOfBullets(mouseY, mouseX);
  player.collideWithTile();
  player.drawHealthBar();
  player.fillBar();
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

// Get values from grid class and use them
function generateGrid(){ 
  grid.makeTileMap(grid.cols, grid.rows);
}

// Get Values from enemy class and use them
function makeEnemies() {
  enemy.displayEnemy();
  enemy.updatePosition();
  enemy.bounceEnemy();
  enemy.interactWithPlayer();
  enemy.drawHealthBar();
  enemy.fillBar();
}

// Check if bullet and enemy collide, if true, delete bullet and enemy that collided
function bulletCollideWithEnemy() {
  for (let b=0; b<bullets.length; b++) {
    setBoolean.bulletInteract = collideRectRect(enemy.x, enemy.y, enemy.size, enemy.size,
      bullets[b].x, bullets[b].y, bullets[b].radius, bullets[b].radius);
    if (setBoolean.bulletInteract === true) {
      bullets.splice(b, 1);
      enemy.health -= 50;
      if (enemy.health <= 0) {
        coin.push(new Coins(enemy.x, enemy.y));
        countScore.kills += 1;
        enemy = new Enemy(random(width), random(height), 100);
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
      countScore.coins += floor(random(1, 5));
    }
  }
}

function updateScore() {
  fill(255);
  textSize(40);
  text("Coins: " + countScore.coins, width/2, height - 20);
  text("Kills: " + countScore.kills, width/2 + 200, height - 20);
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
    enemy = new Enemy(random(width), random(height), 100);
    coin = [];
  } 
}

class Player {
  constructor(x, y, health) {
    this.x = x; 
    this.y = y;
    this.dX = 10;
    this.dY = 10; 
    this.width = 30;
    this.height = 50;
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
    if (keyIsDown(keyLetter.D) && this.x < width - this.width && frameCount % 10 === 0) {
      states.direction = "right";
      states.spriteState = "pRight";
      this.index = (this.index + 1) % pMoveRight.length;
      if (this.isWalkable === true) {
        this.x += this.dX;
      }
    } 
    else if (keyIsDown(keyLetter.A) && this.x > 0 && frameCount % 10 === 0) {
      states.direction = "left";
      states.spriteState = "pLeft";
      this.index = (this.index + 1) % pMoveLeft.length;
      if (this.isWalkable === true) {
        this.x -= this.dX;
      }
    } 
    else if (keyIsDown(keyLetter.W) && this.y > 0 &&  frameCount % 10 === 0) {
      states.direction = "up";
      states.spriteState = "pUp";
      this.index = (this.index + 1) % pMoveUp.length;
      if (this.isWalkable === true) {
        this.y -= this.dY;
        this.isWalkable = false; 
      }
    } 
    else if (keyIsDown(keyLetter.S) && this.y < height - this.height && frameCount % 10 === 0) {
      states.direction = "down";
      states.spriteState = "pDown";
      this.index = (this.index + 1) % pMoveDown.length;
      if (this.isWalkable === true) { 
        this.y += this.dY;
      }
    }
  }

  // Check the tile if the tile is walkable
  collideWithTile() { 
    if (states.direction === "up") { // Top tile colision
      let gridX = floor((this.x + this.width/2)/grid.cellW);
      let gridY = floor(this.y/grid.cellH); 
      if (grid.myMap[gridY][gridX] === "." || grid.myMap[gridY][gridX] === "G") {
        this.isWalkable = true;
      }
      else {
        this.isWalkable = false;
      }
    }
    else if (states.direction === "down") { // Down tile colision
      let gridX = floor((this.x + this.width/2)/grid.cellW);
      let gridY = floor((this.y + this.height)/grid.cellH); 
      if (grid.myMap[gridY][gridX] === "." || grid.myMap[gridY][gridX] === "G") {
        this.isWalkable = true;
      }
      else {
        this.isWalkable = false;
      }
    }
    else if (states.direction === "left") { // Left tile colision
      let gridX = floor((this.x )/grid.cellW);
      let gridY = floor((this.y + this.height/2)/grid.cellH); 
      if (grid.myMap[gridY][gridX] === "." || grid.myMap[gridY][gridX] === "G") {
        this.isWalkable = true;
      }
      else {
        this.isWalkable = false;
      }
    }
    else if (states.direction === "right") { // Right tile colision
      let gridX = floor((this.x+this.width)/grid.cellW);
      let gridY = floor((this.y + this.height/2)/grid.cellH); 
      if (grid.myMap[gridY][gridX] === "." || grid.myMap[gridY][gridX] === "G") {
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
    let gridX = floor(this.x/grid.cellW);
    let gridY = floor(this.y/grid.cellH); 
    if (grid.myMap[gridY][gridX] === "." || grid.myMap[gridY][gridX] === "G") {
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
    this.radius = 8;
  }
  
  displayBullets() { 
    image(images.bullet, this.x, this.y, this.radius*2, this.radius*2);
  }
} 
  
// Extends of bullet class
class Boomerang extends Bullet {
  constructor(pX, pY) {
    super(pX, pY);
    this.radius = 12;
  }
  
  displayBullets() {
    image(images.boomerang, this.x, this.y, this.radius*2, this.radius*2);
  }
}

class Enemy {
  constructor(x, y, health) {
    this.x = x;
    this.y = y;
    this.dX = random(0, 1); 
    this.dY = random(0, 1);
    this.size = 25;
    this.barWidth = 50; 
    this.barHeight = 8;
    this.health = health;
    this.maxHealth = health;
    this.playerInteract = false;
  }
  
  displayEnemy() {
    imageMode(CENTER);
    image(images.enemy, this.x, this.y, this.size, this.size);
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
  // Check if player collide with enemy, true, player health decrease one
  interactWithPlayer() {
    this.playerInteract = collideRectRect(this.x, this.y, this.size, this.size, player.x, player.y, player.width, player.height);
    if (this.playerInteract === true) {
      player.health -= 10;
    } 
  }  

  // Draw outline of the Bar
  drawHealthBar() {
    stroke(2);
    strokeWeight(2);
    noFill();
    rect(this.x-22, this.y-20, this.barWidth, this.barHeight);
  }
  
  fillBar() {
    noStroke();
    fill(225,25,25);
    let drawWidth = this.health*this.barWidth / this.maxHealth;
    rect(this.x-22, this.y-20, drawWidth, this.barHeight);
  }
}

class Grid {
  constructor() {
    this.myMap = strings.tileLayout;
    this.cols = this.myMap.length;
    this.rows = this.myMap[0].length-1;
    this.cellW = width/this.cols;
    this.cellH = height/this.rows;
  }
  
  // Make the tiles size according to the cols and rows, and use value of strings 
  makeTileMap(theCols, theRows) { 
    for (let x = 0; x < theCols; x++) { 
      for (let y = 0; y < theRows; y++) {
        if (this.myMap[y][x] === "G") { // Ground Tile
          image(images.ground, x * this.cellW, y * this.cellH, this.cellW, this.cellH);
        }
        else if (this.myMap[y][x] === "S") { // Stone Tile
          image(images.stone, x * this.cellW, y * this.cellH, this.cellW, this.cellH);
        }
        else if (this.myMap[y][x] === "W") { // Wayer Tile
          image(images.water, x * this.cellW, y * this.cellH, this.cellW, this.cellH);
        }
        else if (this.myMap[y][x] === ".") { // Grass Tile
          image(images.grass, x * this.cellW, y * this.cellH, this.cellW, this.cellH);
        }
      }
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
      this.score += floor(random(1, 5));
      // sounds.coinSound.setVolume(0.5);
      // sounds.coinSound.play();
    } 
  } 
}    

