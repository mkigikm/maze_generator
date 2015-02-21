function HexMazeCanvasView (rows, cols, padding, wallWidth, canvas) {
  MazeCanvasView.call(this, rows, cols, padding, wallWidth, canvas);
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

HexMazeCanvasView.prototype.hexWidth = function () {
  return 22;
};

HexMazeCanvasView.prototype.centerX = function (row, col) {
  return col * 32 + (row % 2 === 0 ? 11 : 27);
};

HexMazeCanvasView.prototype.centerY = function (row, col) {
  return row * 8 + 8;
};

HexMazeCanvasView.prototype.refreshHex = function (maze, row, col) {
  var x = this.centerX(row, col),
      y = this.centerY(row);

  if (maze.drWall(row, col)) {
    this.drawWall(x + 11, y, x + 5, y + 8);
  }

  if (maze.dWall(row, col)) {
    this.drawWall(x + 5, y + 8, x - 5, y + 8);
  }

  if (maze.dlWall(row, col)) {
    this.drawWall(x - 5, y + 8, x - 11, y);
  }

  if (maze.urWall(row, col)) {
    this.drawWall(x + 11, y, x + 5, y - 8);
  }

  if (maze.uWall(row, col)) {
    this.drawWall(x + 5, y - 8, x - 5, y - 8);
  }

  if (maze.ulWall(row, col)) {
    this.drawWall(x - 5, y - 8, x - 11, y);
  }
};
