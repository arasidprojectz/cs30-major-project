class Health {
  constructor(x, y, rectWidth, rectHeight, health, maxHealth) {
    this.x = x;
    this.y = y; 
    this.rectWidth = rectWidth;
    this.rectHeight = rectHeight;
    this.health = health; 
    this.maxHealth = maxHealth;
  }
  
  checkColor() {
    if (this.health < 40)
    {
      fill(255, 0, 0);
    }  
    else if (this.health < 80)
    {
      fill(255, 200, 0);
    }
    else
    {
      fill(0, 255, 0);
    }
  }
  
  drawBar() { // Draw outline of the Bar
    stroke(0);
    strokeWeight(2);
    noFill();
    rect(this.x, this.y, this.rectWidth, this.rectHeight);
  }
}

class playerH extends Health {
  constructor(x, y, health, maxHealth) {
    super(x, y, 40, 10);
    this.health = health;
    this.maxHealth = maxHealth
  }

  updatePos(x, y) {
    this.x = x;
    this.y = y; 
  }

  fillBar() {
    noStroke();
    let drawWidth = (this.health*this.rectWidth)/this.maxHealth;
    rect(this.x, this.y, drawWidth, this.rectHeight);
  }
}

// class enemyH extends Health {
//   constructor(x, y) {
//     super(x, y, 40, 10, 100, 100);
//   }

//   updatePos(x, y) {
//     this.x = x;
//     this.y = y; 
//   }

//   fillBar() {
//     noStroke();
//     let drawWidth = (this.health*this.rectWidth)/this.maxHealth;
//     rect(this.x, this.y, drawWidth, this.rectHeight);
//   }
// }
