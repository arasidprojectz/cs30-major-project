class Health {
  constructor(x, y, health, maxHealth) {
    this.x = x;
    this.y = y; 
    this.rectWidth = 200;
    this.rectHeight = 25;
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
    strokeWeight(4);
    noFill();
    rect(this.x, this.y, this.rectWidth, this.rectHeight);
  }

  fillBar() {
  noStroke();
  let drawWidth = (this.health / this.maxHealth) * this.rectWidth;
  rect(this.x, this.y, drawWidth, this.rectHeight);
  }
}

