// CS30 Major Project
// Al Rasid Mamun
// Jan 6, 2020

let images, sounds, strings;
let gameSetup, setScore, setTime, setBoolean;
let states, bulletList;
let player, enemy = [], bullets = [], coins = [];
let playerHealthBar, enemyHealthBar;
const WIDTH = 1050; const HEIGHT = 750;

function preload() {
  // Images which are pre-loaded
  images = { 
    introBG: loadImage("assets/images/bg/intro_bg.jpg"),
    gameBG: loadImage("assets/images/bg/game_bg.jpg"),
    cursorImg: loadImage("assets/images/items/cursor.png"),
    inGameCursorImg: loadImage("assets/images/items/target.png"),
    gameTitleImg: loadImage("assets/images/text/game_title.png"),
    newGameTitle: loadImage("assets/images/text/new_game.png"),
    guideTitle: loadImage("assets/images/text/guide_title.png"),
    buttonH: loadImage("assets/images/button/button_h.png"),
    buttonNH: loadImage("assets/images/button/button_nh.png"),
    playerImg: loadImage("assets/images/players/gunfighter.png"),
    bulletImg: loadImage("assets/images/items/fire_ball.png"),
    enemyImg: loadImage("assets/images/enemy/enemy.png"),
    boomerangImg: loadImage("assets/images/items/boomerang.png"),
    grassImg: loadImage("assets/images/tiles/grass.png"),
    groundImg: loadImage("assets/images/tiles/ground.jpg"),
    stoneImg: loadImage("assets/images/tiles/stone.png"),
    waterImg: loadImage("assets/images/tiles/water.png"),
  }; 

  // Sounds which are pre-loaded
  sounds = { 
    introSound: loadSound("assets/sounds/intro_music.wav"),
    bgSound: loadSound("assets/sounds/background_music.mp3"),
    coinSound: loadSound("assets/sounds/collet_coin.mp3"),
    shootSound: loadSound("assets/sounds/shoot_bullet.mp3"),
    gameOverSound: loadSound("assets/sounds/game_over.mp3")
  };

  // Strings which are pre-loaded 
  strings = {
    tileLayout: loadStrings("assets/grid/forest.txt"),
  };
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  // Make a new player at center of screen
  player = new Player(width/2, height/2);
  // Make a new grid
  grid = new Grid();
  playerHealthBar = new playerH(player.playerX, player.playerY-15, 100, 100);
  enemyHealthBar = new enemyH(enemy.enemyX, enemy.enemyY, 100,100);
  

  // Button and Cursor Values
  gameSetup = {
    cursorX: width/2, 
    cursorY: height/2, 
    cursorSize: 25,
    buttonX: width/2, 
    buttonY: height/2,
    buttonW: 400,
    buttonH: 200,
    respawnBullet: 0,
    bulletTime: 400,
    respawnEnemy: 0,
    enemyTime: 4000,
    playerHp: 100
  };

  // State Values
  states = {
    game: "toStart",
    attack: " "
  };

  // Make an array of bullets
  bulletList = new Array();
  bulletList[0] = "fireBall";
  bulletList[1] = "boomerang";

  // Booleans Values
  setBoolean = {
    bulletInteract: false,
  };
}

function draw() {
  imageMode(CORNER);
  if (states.game === "toStart") {
    background(images.introBG);
    makeButton();
    displayTitles();
    displayCursor();
  }
  
  if (states.game === "guide") {
    background(images.gameBG);
    gameGuide();
  }
  
  if (states.game === "bulletList") {
    background(images.gameBG);
    makeBulletList();
    displayOptions();
    displayCursor();
  }
  
  if (states.game === "runGame") {
    gameRun();
    displayGameCursor();
  }
}
 
// Mouse Cursor
function mouseMoved() { // if mouse move, cursorX and cursorY to mouseX and mouseY
  noCursor();
  gameSetup.cursorX = mouseX;
  gameSetup.cursorY = mouseY;
}

function displayGameCursor() { // Display image
  image(images.inGameCursorImg, gameSetup.cursorX, gameSetup.cursorY, gameSetup.cursorSize, gameSetup.cursorSize);
}

function displayCursor() { // Display image
  image(images.cursorImg, gameSetup.cursorX, gameSetup.cursorY, gameSetup.cursorSize, gameSetup.cursorSize);
}

// Title
function displayTitles() { // Display all titles in game
  let titleX = width/2; 
  let titleY = height/5; 
  let titleW = 800; 
  let titleH = 250;
  let nSideW = 250; 
  let nSideH = 50;
  let gSideW = 180; 
  let gSideH = 50;


  // Game Title
  imageMode(CENTER);
  image(images.gameTitleImg, titleX, titleY, titleW, titleH);

  // New Game Title
  imageMode(CENTER);
  image(images.newGameTitle, gameSetup.buttonX, gameSetup.buttonY + 20, nSideW, nSideH);

  // Guide Title
  imageMode(CENTER);
  image(images.guideTitle, gameSetup.buttonX, gameSetup.buttonY + 150, gSideW, gSideH);
}

// Game States
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

function gameRun() { // Runs the game
  makeGrid();
  makePlayer();
  makeBullets();
  checkCollided();
  bulletCollideWithTile();
  removeBullet();
  enemyRespawnRandom();
  generateEnemy(); 
  makePlayerHealthBarBar();
  playerHealth();
  makeEnemyHealthBarBar();
  // removeEnemy();
}

function makeButton() { // Display buttons, if mouse pressed change state
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

function makeBulletList() { // Draw text, if mouse pressed, game start
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
    image(images.bulletImg, bX - 100, bY, bSize*1.2, bSize*1.2);
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
    image(images.bulletImg, bX - 100, bY, bSize, bSize);
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
    image(images.boomerangImg, bX + 100, bY, bSize*1.5, bSize*1.5);
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
    image(images.boomerangImg, bX + 100, bY, bSize*1.25, bSize*1.25);
    pop();
  }
}

// Apply the value of bulletList and make new bullet
function bulletOptions() {
  if (states.attack === bulletList[0]) {
    bullets.push(new Fire(player.playerX, player.playerY));  
  }
  else {
    bullets.push(new Boomerang(player.playerX, player.playerY));  
  }
}

// Get values from player class and use them in player
function makePlayer() {
  player.displayPlayer();
  player.movePlayer();
  player.angleOfBullets(mouseY, mouseX);
  player.collideWithTile();
}

// Get values from bullet class and use them in bullets array
function makeBullets() {
  for (let i=0; i<bullets.length; i++) {
    bullets[i].displayBullets();
    bullets[i].shootBullets();
    bullets[i].collideWithTile();
  }
}

// Make a new bullet, if mouse pressed and push it to array 
function mousePressed() {
  if (states.game === "runGame") {
    if (millis() > gameSetup.respawnBullet + gameSetup.bulletTime) {
      bulletOptions();
      gameSetup.respawnBullet = millis();
      sounds.shootSound.setVolume(0.5);
      sounds.shootSound.play();
      sounds.shootSound.playMode("restart");
    }
  }
  if (!playerHealthBar.health <= 0) {
    loop();
  }
}

// Delete bullet if at edge of screen 
function removeBullet() {
  for (let i = 0; i<bullets.length; i++) {
    if (bullets[i].bulletX < 0 || bullets[i].bulletX > width ||
        bullets[i].bulletY < 0 || bullets[i].bulletY > height) {
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
function makeGrid(){ 
  grid.makeTileMap(grid.cols, grid.rows);
}

// Make a new enemy every three seconds and push it to array 
function generateEnemy() {
  if (millis() > gameSetup.respawnEnemy + gameSetup.enemyTime) {
    enemy.push(new Enemy(random(width - player.playerX), random(height - player.playerY), player.playerX, player.playerY));  
    gameSetup.respawnEnemy = millis();
  }  
}

// Get Values from enemy class and use them in enemy array
function enemyRespawnRandom() {
  for (let i=0; i<enemy.length; i++) {
    enemy[i].displayEnemy();
    enemy[i].updatePosition();
    enemy[i].interactWithPlayer();
  } 
}

// // Enemy collide with player, delete enemy
// function removeEnemy() {
//   for (let i=0; i<enemy.length; i++) {
//     if (enemy[i].playerInteract === true) {
//       enemy.splice(i,1);
//     }
//   }
// }

// Check if bullet and enemy collide, if true, delete bullet and enemy that collided
function checkCollided() {
  for (let e=0; e<enemy.length; e++) { 
    for (let b=0; b<bullets.length; b++) {
      setBoolean.bulletInteract = collideRectRect(enemy[e].enemyX, enemy[e].enemyY, enemy[e].enemySize, enemy[e].enemySize,
        bullets[b].bulletX, bullets[b].bulletY, bullets[b].radius, bullets[b].radius);
      if (setBoolean.bulletInteract === true) {
        bullets.splice(b, 1);
        // enemy[e].healthBar.health -= 50;
        // if (enemy[e].healthBar <= 0) {
          enemy.splice(e, 1);
        // }
      } 
    }
  }
}

// Health Bar 
function makePlayerHealthBarBar() {
  playerHealthBar.checkColor();
  playerHealthBar.fillBar();
  playerHealthBar.drawBar();
  playerHealthBar.updatePos(player.playerX, player.playerY);
}

function playerHealth() {
  if (playerHealthBar.health <= 0) {
    states.game = "toStart"
    playerHealthBar.health = 100;
  }
}

function makeEnemyHealthBarBar() {
  for (let i = 0; i<enemy.length; i++) {
    enemyHealthBar.checkColor();
    enemyHealthBar.fillBar();
    enemyHealthBar.drawBar();
    enemyHealthBar.updatePos(enemy[i].enemyX, enemy[i].enemyY);
  } 
}