function HexMaze (rows, cols, start) {
  Maze.call(this, rows, cols, start);
};

HexMaze.prototype = Object.create(Maze.prototype);

HexMaze.DR =  1;
HexMaze.D  =  2;
HexMaze.DL =  4;
HexMaze.UL =  8;
HexMaze.U  = 16;
HexMaze.UR = 32;

HexMaze.DIRS = [HexMaze.DR, HexMaze.D, HexMaze.DL,
  HexMaze.UL, HexMaze.U, HexMaze.UR];

HexMaze.prototype.dirs = function () {
  return HexMaze.DIRS;
};

HexMaze.prototype.rowAdd = function (row, col, dir) {
  switch (dir) {
    case HexMaze.D:
      return row + 2;
    case HexMaze.U:
      return row - 2;
    case HexMaze.DR:
    case HexMaze.DL:
      return row + 1;
    case HexMaze.UR:
    case HexMaze.UL:
      return row - 1;
  }
};

HexMaze.prototype.colAdd = function (row, col, dir) {
  switch (dir) {
    case HexMaze.D:
    case HexMaze.U:
      return col;
    case HexMaze.DR:
    case HexMaze.UR:
      return col + (row % 2 ? 1 : 0);
    case HexMaze.DL:
    case HexMaze.UL:
      return col + (row % 2 ? 0 : -1);
  }
};

HexMaze.prototype.drWall = function (row, col) {
  return this.nativeWall(row, col, HexMaze.DR);
};

HexMaze.prototype.dWall = function (row, col) {
  return this.nativeWall(row, col, HexMaze.D);
};

HexMaze.prototype.dlWall = function (row, col) {
  return this.nativeWall(row, col, HexMaze.DL);
};

HexMaze.prototype.ulWall = function (row, col) {
  var nrow = this.rowAdd(row, col, HexMaze.UL),
      ncol = this.colAdd(row, col, HexMaze.UL);

  if (this.outOfBounds(nrow, ncol)) {
    return HexMaze.UL;
  }
  return this.drWall(nrow, ncol, HexMaze.DR) << 3;
};

HexMaze.prototype.uWall = function (row, col) {
  var nrow = this.rowAdd(row, col, HexMaze.U),
      ncol = this.colAdd(row, col, HexMaze.U);

  if (this.outOfBounds(nrow, ncol)) {
    return HexMaze.U;
  }
  return this.dWall(nrow, ncol, HexMaze.D) << 3;
};

HexMaze.prototype.urWall = function (row, col) {
  var nrow = this.rowAdd(row, col, HexMaze.UR),
      ncol = this.colAdd(row, col, HexMaze.UR);

  if (this.outOfBounds(nrow, ncol)) {
    return HexMaze.U;
  }
  return this.dlWall(nrow, ncol, HexMaze.DL) << 3;
};

HexMaze.prototype.walls = function (row, col) {
  return this.drWall(row, col) | this.dWall(row, col) |
    this.dlWall(row, col) | this.ulWall(row, col) |
    this.uWall(row, col)  | this.urWall(row, col);
};

HexMaze.prototype.crushWall = function (row, col, dir) {
  var nrow, ncol;

  if (dir & (HexMaze.DL | HexMaze.D | HexMaze.DR)) {
    this.crushNativeWall(row, col, dir);
  } else {
    this.crushNativeWall(this.rowAdd(row, col, dir),
      this.colAdd(row, col, dir), dir >> 3);
  }
};

HexMaze.prototype.crushNativeWall = function (row, col, dir) {
  this.grid[row][this.colShift(col)] ^= dir << this.bitShift(col);
}
