function MazeCanvasView (rows, cols, sideLength, wallThickness, canvas) {
  this.rows          = rows;
  this.cols          = cols;
  this.sideLength    = sideLength;
  this.wallThickness = wallThickness;
  this.canvas        = canvas;
  this.ctx           = canvas.getContext("2d");

  canvas.height = this.canvasHeight();
  canvas.width  = this.canvasWidth();

  this.ctx.strokeStyle = 'black';
  this.ctx.lineWidth   = this.wallThickness;
};

MazeCanvasView.prototype.clear = function () {
  this.ctx.clearRect(0, 0, this.canvasWidth(), this.canvasHeight());
};
