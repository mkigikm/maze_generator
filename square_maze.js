function SquareMaze (rows, cols, start) {
  Maze.call(this, rows, cols, start);
};

SquareMaze.prototype = Object.create(Maze.prototype);

SquareMaze.DOWN  = 1;
SquareMaze.RIGHT = 2;
SquareMaze.UP    = 4;
SquareMaze.LEFT  = 8;

SquareMaze.DIRS      = [SquareMaze.DOWN, SquareMaze.RIGHT,
  SquareMaze.UP, SquareMaze.LEFT];

SquareMaze.prototype.dirs = function () {
  return SquareMaze.DIRS;
};

SquareMaze.prototype.rowAdd = function (row, col, dir) {
  if ((dir & (SquareMaze.LEFT | SquareMaze.RIGHT)) > 0) {
    return row;
  }
  return row + (dir === SquareMaze.DOWN ? 1 : -1);
};

SquareMaze.prototype.colAdd = function (row, col, dir) {
  if ((dir & (SquareMaze.UP | SquareMaze.DOWN)) > 0) {
    return col;
  }
  return col + (dir === SquareMaze.RIGHT ? 1 : -1);
};

SquareMaze.prototype.downWall = function (row, col) {
  return this.nativeWall(row, col, SquareMaze.DOWN);
};

SquareMaze.prototype.rightWall = function (row, col) {
  return this.nativeWall(row, col, SquareMaze.RIGHT);
};

SquareMaze.prototype.upWall = function (row, col) {
  return row === 0 ? SquareMaze.UP :
    this.downWall(row - 1, col) << this.bits;
};

SquareMaze.prototype.leftWall = function (row, col) {
  return col === 0 ? SquareMaze.LEFT :
    this.rightWall(row, col - 1) << this.bits;
};

SquareMaze.prototype.wallChecks = function () {
  return [this.downWall, this.upWall, this.leftWall, this.rightWall];
}

SquareMaze.prototype.walls = function (row, col) {
  return this.downWall(row, col) | this.upWall(row, col) |
    this.leftWall(row, col) | this.rightWall(row, col);
};

SquareMaze.prototype.crushWall = function (row, col, dir) {
  if (this.outOfBounds(row,col)) {
    return;
  }

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

SquareMaze.prototype.buildWall = function (row, col, dir) {
  if (this.outOfBounds(row, col)) {
    return;
  }

  switch (dir) {
    case SquareMaze.DOWN:
    case SquareMaze.RIGHT:
      this.grid[row][this.colShift(col)] |= dir << this.bitShift(col);
      break;
    case SquareMaze.UP:
      this.buildWall(row - 1, col, SquareMaze.DOWN);
      break;
    case SquareMaze.LEFT:
      this.buildWall(row, col - 1, SquareMaze.RIGHT);
      break;
  }
};

SquareMaze.prototype.smashWalls = function (row, col) {
  this.dirs().forEach(function (dir) {
    this.crushWall(row, col, dir);
  }, this);
};
