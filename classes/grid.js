class Grid {
  constructor() {
    this.myMap = strings.tileLayout;
    this.cols = this.myMap.length;
    this.rows = this.myMap[0].length-1;
    this.cellW = width/this.cols;
    this.cellH = height/this.rows;
  }

  makeTileMap(theCols, theRows) { // Make the tiles size according to the cols and rows, and use value of strings 
    for (let x = 0; x < theCols; x++) { 
      for (let y = 0; y < theRows; y++) {
        if (this.myMap[y][x] === "G") { // Ground Tile
          image(images.groundImg, x * this.cellW, y * this.cellH, this.cellW, this.cellH);
        }
        else if (this.myMap[y][x] === "S") { // Stone Tile
          image(images.stoneImg, x * this.cellW, y * this.cellH, this.cellW, this.cellH);
        }
        else if (this.myMap[y][x] === "W") { // Wayer Tile
          image(images.waterImg, x * this.cellW, y * this.cellH, this.cellW, this.cellH);
        }
        else if (this.myMap[y][x] === ".") { // Grass Tile
          image(images.grassImg, x * this.cellW, y * this.cellH, this.cellW, this.cellH);
        }
      }
    }
  }
}
