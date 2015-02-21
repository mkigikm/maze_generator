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

HexMaze.prototype.rowOffset = function (dir) {
  return (dir & (HexMaze.UL | HexMaze.U | HexMaze.UR)) > 0 ? -1 : 1;
};

HexMaze.prototype.colOffset = function (dir) {
  if ((dir & (HexMaze.UP | HexMaze.DOWN)) > 0) {
    return 0;
  }
  return dir === HexMaze.UR | HexMaze.DR ? 1 : -1;
};

HexMaze.prototype.drWall = function (row, col) {
  return this.nativeWall(row, col, HexMaze.DR);
};

HexMaze.prototype.dWall = function (row, col) {
  return this.nativeWall(row, col, HexMaze.D);
};

HexMaze.prototype.dlWall = function (row, col) {
  return this.nativeWall(row, col, HexMaze.D);
};

HexMaze.prototype.ulWall = function (row, col) {
  return row === 0 ? HexMaze.UL :
    this.drWall(row - 1, col - 1) << 3;
};

HexMaze.prototype.uWall = function (row, col) {
  return row === 0 ? HexMaze.UP :
    this.dWall(row - 1, col) << 3;
};

HexMaze.prototype.urWall = function (row, col) {
  return row === 0 ? HexMaze.UR :
    this.dlWall(row - 1, col + 1) << 3;
};

SquareMaze.prototype.walls = function (row, col) {
  return this.drWall(row, col) | this.dWall(row, col) |
    this.dlWall(row, col) | this.ulWall(row, col) |
    this.uWall(row, col)  | this.urWall(row, col);
};

SquareMaze.prototype.crushWall = function (row, col, dir) {
  switch (dir) {
    case HexMaze.DL:
    case HexMaze.D:
    case HexMaze.DR:
      this.grid[row][this.colShift(col)] ^=
        dir << this.bitShift(col);
      break;
    case HexMaze.UL:
      this.crushWall(row - 1, col - 1, HexMaze.DR);
      break;
    case HexMaze.U:
      this.crushWall(row - 1, col, HexMaze.D);
      break;
    case HexMaze.UR:
      this.crushWall(row - 1, col + 1, HexMaze.DL);
  }
};
