HexMaze.prototype = new Maze();
HexMaze.prototype.constructor = Maze;
function HexMaze (rows, cols, start) {
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

HexMaze.DR =  1;
HexMaze.D  =  2;
HexMaze.DL =  4;
HexMaze.UL =  8;
HexMaze.U  = 16;
HexMaze.UR = 32;

HexMaze.DIRS = [HexMaze.DR, HexMaze.D, HexMaze.DL,
  HexMaze.UL, HexMaze.U, HexMaze.UR];

HexMaze.UNVISITED = HexMaze.DR | HexMaze.D | HexMaze.DL |
  HexMaze.UL | HexMaze.U | HexMaze.UR;

HexMaze.CELLS_PER_INT = 10;

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

HexMaze.prototype.bitShift = function (col) {
  return (col % HexMaze.CELLS_PER_INT) * 2;
};

HexMaze.prototype.colShift = function (col) {
  return col / HexMaze.CELLS_PER_INT | 0;
};

HexMaze.prototype.downWall = function (row, col) {
  return (this.grid[row][this.colShift(col)] >> this.bitShift(col))
    & HexMaze.DOWN;
};

HexMaze.prototype.upWall = function (row, col) {
  return row === 0 ? HexMaze.UP :
    this.downWall(row - 1, col) << 3;
};

HexMaze.prototype.visited = function (row, col) {
  return this.walls(row, col) !== HexMaze.UNVISITED;
};

SquareMaze.prototype.walls = function (row, col) {
  return this.downWall(row, col) | this.upWall(row, col) |
    this.leftWall(row, col) | this.rightWall(row, col);
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
