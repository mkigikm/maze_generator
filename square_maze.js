SquareMaze.prototype = new Maze();
SquareMaze.prototype.constructor = Maze;
function SquareMaze (rows, cols, start) {
  var i, j;

  this.grid  = new Array(rows);
  this.rows  = rows;
  this.cols  = cols;
  this.stack = [];
  this.cur   = start;
  this.start = this.cur;

  for (row = 0; row < rows; row++) {
    this.grid[row] = new Int32Array(this.colShift(cols) + 1);

    for (col = 0; col < cols; col++) {
      this.grid[row][col] = ~0;
    }
  }
};

SquareMaze.DOWN  = 1;
SquareMaze.RIGHT = 2;
SquareMaze.UP    = 4;
SquareMaze.LEFT  = 8;

SquareMaze.DIRS      = [SquareMaze.DOWN, SquareMaze.RIGHT,
  SquareMaze.UP, SquareMaze.LEFT];
SquareMaze.UNVISITED = SquareMaze.DOWN | SquareMaze.RIGHT |
  SquareMaze.UP | SquareMaze.LEFT;

SquareMaze.CELLS_PER_INT = 16;

SquareMaze.prototype.dirs = function () {
  return SquareMaze.DIRS;
};

SquareMaze.prototype.rowOffset = function (dir) {
  if ((dir & (SquareMaze.LEFT | SquareMaze.RIGHT)) > 0) {
    return 0;
  }
  return dir === SquareMaze.DOWN ? 1 : -1;
};

SquareMaze.prototype.colOffset = function (dir) {
  if ((dir & (SquareMaze.UP | SquareMaze.DOWN)) > 0) {
    return 0;
  }
  return dir === SquareMaze.RIGHT ? 1 : -1;
};

SquareMaze.prototype.bitShift = function (col) {
  return (col % SquareMaze.CELLS_PER_INT) * 2;
};

SquareMaze.prototype.colShift = function (col) {
  return col / SquareMaze.CELLS_PER_INT | 0;
};

SquareMaze.prototype.downWall = function (row, col) {
  return (this.grid[row][this.colShift(col)] >> this.bitShift(col))
    & SquareMaze.DOWN;
};

SquareMaze.prototype.upWall = function (row, col) {
  return row === 0 ? SquareMaze.UP :
    this.downWall(row - 1, col) << 2;
};

SquareMaze.prototype.rightWall = function (row, col) {
  return (this.grid[row][this.colShift(col)] >> this.bitShift(col))
    & SquareMaze.RIGHT;
};

SquareMaze.prototype.leftWall = function (row, col) {
  return col === 0 ? SquareMaze.LEFT :
    this.rightWall(row, col - 1) << 2;
};

SquareMaze.prototype.visited = function (row, col) {
  return this.walls(row, col) !== SquareMaze.UNVISITED;
};

SquareMaze.prototype.walls = function (row, col) {
  return this.downWall(row, col) | this.upWall(row, col) |
    this.leftWall(row, col) | this.rightWall(row, col);
};

SquareMaze.prototype.crushWall = function (row, col, dir) {
  switch (dir) {
    case SquareMaze.DOWN:
    case SquareMaze.RIGHT:
      this.grid[row][this.colShift(col)] ^=
        dir << this.bitShift(col);
      break;
    case SquareMaze.UP:
      this.crushWall(row - 1, col, SquareMaze.DOWN);
      break;
    case SquareMaze.LEFT:
      this.crushWall(row, col -1, SquareMaze.RIGHT);
      break;
  }
};
