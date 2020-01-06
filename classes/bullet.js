class Bullet {
  constructor(pX, pY) {
    this.bulletX = pX; 
    this.bulletY = pY; 
    this.bulletDX = 0;
    this.bulletDY = 0;
    this.angle = 0;
    this.isMoveable = false;
  }

  // Update x and y values with dx and dy
  update() {
    this.bulletX += this.bulletDX;
    this.bulletY += this.bulletDY;
  }

  // Use angle given by player, change the values of dx and dy
  shootBullets() {
    this.angle = player.aimAngle;
    this.bulletDX = player.bulletDistance * cos(this.angle)*8;
    this.bulletDY = player.bulletDistance * sin(this.angle)*8;
  }

  collideWithTile() {
    let gridX = floor(this.bulletX/grid.cellW);
    let gridY = floor(this.bulletY/grid.cellH); 
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
    this.radius = 5;
  }

  // Show image
  displayBullets() { 
    image(images.bulletImg, this.bulletX, this.bulletY, this.radius*2, this.radius*2);
  }
} 

// Extends of bullet class
class Boomerang extends Bullet {
  constructor(pX, pY) {
    super(pX, pY);
    this.radius = 10;
  }

  // Show image
  displayBullets() {
    image(images.boomerangImg, this.bulletX, this.bulletY, this.radius*2, this.radius*2);
  }
}