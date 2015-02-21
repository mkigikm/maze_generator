function HexMazeCanvasView (rows, cols, sideLength, wallThickness, canvas) {
  MazeCanvasView.call(this, rows, cols, sideLength, wallThickness, canvas);
};

HexMazeCanvasView.prototype = Object.create(MazeCanvasView.prototype);

HexMazeCanvasView.prototype.canvasHeight = function () {
  return 1000;
};

HexMazeCanvasView.prototype.canvasWidth = function () {
  return 1000;
};

HexMazeCanvasView.prototype.refreshInterior = function (maze) {
  var row, col;

  for (row = 0; row < this.rows; row++) {
    for (col = 0; col < this.cols; col++) {
      this.refreshHex(maze, row, col);
    }
  }
};

HexMazeCanvasView.prototype.refreshCur = function (row, col) {
  this.ctx.beginPath();
  this.ctx.arc(this.centerX(row, col), this.centerY(row, col), 5, 0, 2 * Math.PI, false);
  this.ctx.fillStyle = 'red';
  this.ctx.fill();
};

HexMazeCanvasView.prototype.refreshBorder = function () {
};

HexMazeCanvasView.prototype.hexHeight = function () {
  return 16 * this.sideLength / 5;
};

HexMazeCanvasView.prototype.centerX = function (row, col) {
  var offset = row % 2 === 0 ? this.hexHeight() / 2 : this.hexHeight();
  return col * this.hexHeight() + offset - this.sideLength / 2;
};

HexMazeCanvasView.prototype.centerY = function (row, col) {
  return (row + 1) * this.hexHeight() / 4;
};

// The geometry here looks like this
//   (center)   r   /r+a
//                 /
//                /
//   ___________b/
HexMazeCanvasView.prototype.refreshHex = function (maze, row, col) {
  var x = this.centerX(row, col),
      y = this.centerY(row),
      a = this.sideLength * 3 / 5;
      b = this.sideLength * 4 / 5;
      r = this.sideLength / 2;

  if (maze.drWall(row, col)) {
    this.drawWall(x + (r + a), y, x + r, y + b);
  }

  if (maze.dWall(row, col)) {
    this.drawWall(x + r, y + b, x - r, y + b);
  }

  if (maze.dlWall(row, col)) {
    this.drawWall(x - r, y + b, x - (r + a), y);
  }

  if (maze.urWall(row, col)) {
    this.drawWall(x + (r + a), y, x + r, y - b);
  }

  if (maze.uWall(row, col)) {
    this.drawWall(x + r, y - b, x - r, y - b);
  }

  if (maze.ulWall(row, col)) {
    this.drawWall(x - r, y - b, x - (r + a), y);
  }
};
