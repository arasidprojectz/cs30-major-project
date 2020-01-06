let health = 100;
let MAX_HEALTH = 100;
let rectWidth = 200;

function checkColor() {
  // Change color
  if (health < 40) {
    fill(255, 0, 0);
  } 
  else if (health < 80) {
    fill(255, 200, 0);
  } 
  else {
    fill(0, 255, 0);
  }
}

function drawBar() {
  // Outline
  stroke(0);
  strokeWeight(4);
  noFill();
  rect(100, 100, rectWidth, 25);
}


function fillBar() {
    // Draw bar
  noStroke();
  // Get fraction 0->1 and multiply it by width of bar
  let drawWidth = (health / MAX_HEALTH) * rectWidth;
  rect(100, 100, drawWidth, 25);
}


function keyPressed()
{
  if (health > 0 && keyCode === LEFT_ARROW) {
    health -= 10;
  }
  if (health < 100 && keyCode === RIGHT_ARROW) {
    health += 10;
  }
}

