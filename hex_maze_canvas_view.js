function HexMazeCanvasView (rows, cols, sideLength, wallThickness, canvas) {
  MazeCanvasView.call(this, rows, cols, sideLength, wallThickness, canvas);
};

HexMazeCanvasView.prototype = Object.create(MazeCanvasView.prototype);

HexMazeCanvasView.prototype.canvasHeight = function () {
  return (this.rows + 1) * this.hexHeight() / 4 + this.wallThickness;
};

HexMazeCanvasView.prototype.canvasWidth = function () {
  return 2 * (this.cols - 1) * (this.sideLength * 8 / 5) + 19 *
    this.sideLength / 5 + this.wallThickness;
};

HexMazeCanvasView.prototype.refresh = function (maze) {
  var row, col;

  this.clear();

  for (row = 0; row < this.rows; row++) {
    for (col = 0; col < this.cols; col++) {
      this.refreshHex(maze, row, col);
    }
  }
  this.refreshCur(maze.cur[0], maze.cur[1]);
};

HexMazeCanvasView.prototype.refreshCur = function (row, col) {
  this.drawCur(this.centerX(row, col), this.centerY(row), this.hexHeight() / 8);
};

HexMazeCanvasView.prototype.hexHeight = function () {
  return 16 * this.sideLength / 5;
};

HexMazeCanvasView.prototype.centerX = function (row, col) {
  var offset = row % 2 === 0 ? this.hexHeight() / 2 : this.hexHeight();
  return col * this.hexHeight() + offset - this.sideLength / 2 +
    this.wallThickness / 2;
};

HexMazeCanvasView.prototype.centerY = function (row, col) {
  return (row + 1) * this.hexHeight() / 4 + this.wallThickness / 2;
};

// The geometry here looks like this
//         -b___________-b
//          /|         |\
//         / |         | \
//        /  |         |  \
// -(r+a)/ -r|         |r  \r+a
//       \   |         |   /
//        \  |         |  /
//         \ |         | /
//         b\|_________|/b
HexMazeCanvasView.prototype.refreshHex = function (maze, row, col) {
  var x = this.centerX(row, col),
      y = this.centerY(row),
      a = this.sideLength * 3 / 5,
      b = this.sideLength * 4 / 5,
      r = this.sideLength / 2,

      lineOrMove = function (cond, x, y) {
        cond.call(maze, row, col) ? this.lineTo(x, y) : this.moveTo(x, y);
      }.bind(this.ctx);

  this.ctx.save();
  this.ctx.translate(x, y);
  this.ctx.beginPath()
  this.ctx.moveTo(r + a, 0);

  lineOrMove(maze.drWall,        r,  b);
  lineOrMove(maze.dWall ,       -r,  b);
  lineOrMove(maze.dlWall, -(r + a),  0);
  lineOrMove(maze.ulWall,       -r, -b);
  lineOrMove(maze.uWall ,        r, -b);
  lineOrMove(maze.urWall,    r + a,  0);

  this.ctx.stroke();

  this.ctx.restore();
};
