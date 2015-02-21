function SquareMazeCanvasView (rows, cols, sideLength, wallThickness, canvas) {
  MazeCanvasView.call(this, rows, cols, sideLength, wallThickness, canvas);
};

SquareMazeCanvasView.prototype = Object.create(MazeCanvasView.prototype);

SquareMazeCanvasView.prototype.canvasHeight = function () {
  return this.rows * this.sideLength;
};

SquareMazeCanvasView.prototype.canvasWidth = function () {
  return this.cols * this.sideLength;
};

SquareMazeCanvasView.prototype.mazeRowToY = function (row) {
  return row * this.sideLength;
};

SquareMazeCanvasView.prototype.mazeColToX = function (col) {
  return col * this.sideLength;
};

SquareMazeCanvasView.prototype.refreshInterior = function (maze) {
  this.drawRows(maze);
  this.drawCols(maze);
};

SquareMazeCanvasView.prototype.refreshBorder = function () {
  this.drawWall(0, this.canvasHeight()-1, this.canvasWidth()-1,
    this.canvasHeight()-1, 'black');

  this.drawWall(this.canvasWidth() - 1, 0, this.canvasWidth() - 1,
    this.canvasHeight() -1 , 'black');

  this.drawWall(0, 0, this.canvasWidth()-1, 0, 'black');

  this.drawWall(0, 0, 0, this.canvasHeight() -1 , 'black');
};

SquareMazeCanvasView.prototype.refreshCur = function (row, col) {
  var y = this.mazeRowToY(row) + this.padding / 2,
      x = this.mazeColToX(col) + this.padding / 2;

  this.ctx.beginPath();
  this.ctx.arc(x, y, this.padding / 3, 0, 2 * Math.PI, false);
  this.ctx.fillStyle = 'red';
  this.ctx.fill();
};

SquareMazeCanvasView.prototype.drawRows = function (maze) {
  var row, col, startCol, inRow;

  for (row = 1; row < this.rows; row++) {
    inRow = maze.upWall(row, 0);
    startCol = 0;

    for (col = 1; col < this.cols; col++) {
      if (inRow && !maze.upWall(row, col)) {
        inRow = false;
        this.drawRow(row, startCol, col);
      } else if (!inRow && maze.upWall(row, col)) {
        inRow = true;
        startCol = col;
      }
    }
    if (inRow) {
      this.drawRow(row, startCol, col);
    }
  }
};

SquareMazeCanvasView.prototype.drawCols = function (maze) {
  var row, col, startRow, inCol;

  for (col = 1; col < this.cols; col++) {
    inCol = maze.leftWall(0, col);
    startRow = 0;

    for (row = 1; row < this.rows; row++) {
      if (inCol && !maze.leftWall(row, col)) {
        inCol = false;
        this.drawCol(col, startRow, row);
      } else if (!inCol && maze.leftWall(row, col)) {
        inCol = true;
        startRow = row;
      }
    }
    if (inCol) {
      this.drawCol(col, startRow, row);
    }
  }
};

SquareMazeCanvasView.prototype.drawRow = function (row, startCol, endCol) {
  var y  = this.mazeRowToY(row),
      x0 = this.mazeColToX(startCol),
      x1 = this.mazeColToX(endCol);

  this.drawWall(x0, y, x1, y, 'black');
};

SquareMazeCanvasView.prototype.drawCol = function (col, startRow, endRow) {
  var x  = this.mazeColToX(col),
      y0 = this.mazeRowToY(startRow),
      y1 = this.mazeRowToY(endRow);

  this.drawWall(x, y0, x, y1, 'black');
};
