function MazeCanvasView (rows, cols, padding, wallWidth, canvas) {
  this.rows       = rows;
  this.cols       = cols;
  this.padding    = padding;
  this.wallWidth  = wallWidth;
  this.canvas     = canvas;
  this.ctx        = canvas.getContext("2d");

  canvas.height = this.canvasHeight();
  canvas.width  = this.canvasWidth();
};

MazeCanvasView.prototype.canvasHeight = function () {
  return this.rows * this.squareWidth();
};

MazeCanvasView.prototype.canvasWidth = function () {
  return this.cols * this.squareWidth();
};

MazeCanvasView.prototype.squareWidth = function () {
  return this.padding + this.wallWidth;
}

MazeCanvasView.prototype.refresh = function (maze) {

  this.ctx.clearRect(0, 0, this.canvasWidth(), this.canvasHeight());
  this.drawRows(maze);
  this.drawCols(maze);
  this.drawBorder();
  this.refreshCur(maze.cur[0], maze.cur[1]);
};

MazeCanvasView.prototype.drawRows = function (maze) {
  var row, col, startCol, inRow;

  for (row = 0; row < this.rows; row++) {
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

MazeCanvasView.prototype.drawCols = function (maze) {
  var row, col, startRow, inCol;

  for (col = 0; col < this.cols; col++) {
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

MazeCanvasView.prototype.drawRow = function (row, startCol, endCol) {
  var y  = this.mazeRowToY(row),
      x0 = this.mazeColToX(startCol),
      x1 = this.mazeColToX(endCol);

  this.drawWall(x0, y, x1, y, 'black');
};

MazeCanvasView.prototype.drawCol = function (col, startRow, endRow) {
  var x  = this.mazeColToX(col),
      y0 = this.mazeRowToY(startRow),
      y1 = this.mazeRowToY(endRow);

  this.drawWall(x, y0, x, y1, 'black');
};

MazeCanvasView.prototype.refreshCur = function (row, col) {
  var y = this.mazeRowToY(row) + this.squareWidth() / 2,
      x = this.mazeColToX(col) + this.squareWidth() / 2;

  this.ctx.beginPath();
  this.ctx.arc(x, y, this.squareWidth() / 3, 0, 2 * Math.PI, false);
  this.ctx.fillStyle = 'red';
  this.ctx.fill();
};

MazeCanvasView.prototype.drawWall = function (x0, y0, x1, y1) {
  this.ctx.beginPath();

  this.ctx.moveTo(x0, y0);
  this.ctx.lineTo(x1, y1);

  this.ctx.strokeStyle = 'black';
  this.ctx.lineWidth   = this.wallWidth;

  this.ctx.stroke();
};

MazeCanvasView.prototype.drawBorder = function () {
  this.drawWall(0, this.canvasHeight()-1, this.canvasWidth()-1,
    this.canvasHeight()-1, 'black');

  this.drawWall(this.canvasWidth() - 1, 0, this.canvasWidth() - 1,
    this.canvasHeight() -1 , 'black');
}

MazeCanvasView.prototype.mazeRowToY = function (row) {
  return row * this.squareWidth();
};

MazeCanvasView.prototype.mazeColToX = function (col) {
  return col * this.squareWidth();
};
