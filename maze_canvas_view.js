function MazeCanvasView (rows, cols, sideLength, wallThickness, canvas) {
  this.rows          = rows;
  this.cols          = cols;
  this.sideLength    = sideLength;
  this.wallThickness = wallThickness;
  this.canvas        = canvas;
  this.ctx           = canvas.getContext("2d");

  canvas.height = this.canvasHeight();
  canvas.width  = this.canvasWidth();
};

MazeCanvasView.prototype.drawWall = function (x0, y0, x1, y1) {
  this.ctx.beginPath();

  this.ctx.moveTo(x0, y0);
  this.ctx.lineTo(x1, y1);

  this.ctx.strokeStyle = 'black';
  this.ctx.lineWidth   = this.wallThickness;

  this.ctx.stroke();
};

MazeCanvasView.prototype.refresh = function (maze) {
  this.ctx.clearRect(0, 0, this.canvasWidth(), this.canvasHeight());
  this.refreshInterior(maze);
  this.refreshBorder();
  this.refreshCur(maze.cur[0], maze.cur[1]);
};
