function SquareMazeCanvasView (rows, cols, sideLength, wallThickness, canvas) {
  MazeCanvasView.call(this, rows, cols, sideLength, wallThickness, canvas);
};

SquareMazeCanvasView.prototype = Object.create(MazeCanvasView.prototype);

SquareMazeCanvasView.prototype.canvasHeight = function () {
  return this.rows * this.sideLength + this.wallThickness;
};

SquareMazeCanvasView.prototype.canvasWidth = function () {
  return this.cols * this.sideLength + this.wallThickness;
};

SquareMazeCanvasView.prototype.cornerY = function (row) {
  return row * this.sideLength + this.wallThickness / 2;
};

SquareMazeCanvasView.prototype.cornerX = function (col) {
  return col * this.sideLength + this.wallThickness / 2;
};

SquareMazeCanvasView.prototype.refreshInterior = function (maze) {
  this.drawRows(maze);
  this.drawCols(maze);
};

SquareMazeCanvasView.prototype.refreshBorder = function () {
  this.drawRow(0, 0, this.cols);
  this.drawRow(this.rows, 0, this.cols);
  this.drawCol(0, 0, this.rows);
  this.drawCol(this.cols, 0, this.rows);
};

SquareMazeCanvasView.prototype.refreshCur = function (row, col) {
  var y = this.cornerY(row) + this.sideLength / 2,
      x = this.cornerX(col) + this.sideLength / 2;

  this.drawCur(x, y, this.sideLength / 3);
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
  var y  = this.cornerY(row),
      x0 = this.cornerX(startCol),
      x1 = this.cornerX(endCol);

  this.drawWall(x0, y, x1, y);
};

SquareMazeCanvasView.prototype.drawCol = function (col, startRow, endRow) {
  var x  = this.cornerX(col),
      y0 = this.cornerY(startRow),
      y1 = this.cornerY(endRow);

  this.drawWall(x, y0, x, y1);
};

SquareMazeCanvasView.prototype.refresh = function (maze) {
  this.clear();
  this.refreshInterior(maze);
  this.refreshBorder();
  this.refreshCur(maze.cur[0], maze.cur[1]);
};

SquareMazeCanvasView.prototype.drawWall = function (x0, y0, x1, y1) {
  this.ctx.beginPath();

  this.ctx.moveTo(x0, y0);
  this.ctx.lineTo(x1, y1);

  this.ctx.stroke();
};

SquareMazeCanvasView.prototype.fill = function (row, col) {
  var x = this.cornerX(col),
      y = this.cornerY(row);

  this.ctx.save();
  this.ctx.translate(x, y);
  this.ctx.fillStyle = 'black';
  this.ctx.fillRect(0, 0, this.sideLength, this.sideLength);
  this.ctx.restore();
};

SquareMazeCanvasView.prototype.placeRoom = function (srow, scol, erow, ecol) {
  var x = this.cornerX(scol),
      y = this.cornerY(srow);

  this.ctx.fillStyle = 'red';
  this.ctx.fillRect(x, y, this.cornerX(ecol - scol + 1), this.cornerY(erow - srow + 1));
};
