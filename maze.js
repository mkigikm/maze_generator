function Maze (rows, cols, start) {
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

Maze.DOWN  = 1;
Maze.RIGHT = 2;
Maze.UP    = 4;
Maze.LEFT  = 8;

Maze.DIRS      = [Maze.DOWN, Maze.RIGHT, Maze.UP, Maze.LEFT];
Maze.UNVISITED = Maze.DOWN | Maze.RIGHT | Maze.UP | Maze.LEFT;

Maze.CELLS_PER_INT = 16;

Maze.prototype.rowOffset = function (dir) {
  if ((dir & (Maze.LEFT | Maze.RIGHT)) > 0) {
    return 0;
  }
  return dir === Maze.DOWN ? 1 : -1;
};

Maze.prototype.colOffset = function (dir) {
  if ((dir & (Maze.UP | Maze.DOWN)) > 0) {
    return 0;
  }
  return dir === Maze.RIGHT ? 1 : -1;
};

Maze.prototype.bitShift = function (col) {
  return (col % Maze.CELLS_PER_INT) * 2;
};

Maze.prototype.colShift = function (col) {
  return col / Maze.CELLS_PER_INT | 0;
};

Maze.prototype.downWall = function (row, col) {
  return (this.grid[row][this.colShift(col)] >> this.bitShift(col))
    & Maze.DOWN;
};

Maze.prototype.upWall = function (row, col) {
  return row === 0 ? Maze.UP :
    this.downWall(row - 1, col) << 2;
};

Maze.prototype.rightWall = function (row, col) {
  return (this.grid[row][this.colShift(col)] >> this.bitShift(col))
    & Maze.RIGHT;
};

Maze.prototype.leftWall = function (row, col) {
  return col === 0 ? Maze.LEFT :
    this.rightWall(row, col - 1) << 2;
};

Maze.prototype.visited = function (row, col) {
  return this.walls(row, col) !== Maze.UNVISITED;
};

Maze.prototype.walls = function (row, col) {
  return this.downWall(row, col) | this.upWall(row, col) |
    this.leftWall(row, col) | this.rightWall(row, col);
};

Maze.prototype.outOfBounds = function (row, col) {
  return row === -1 || row === this.rows ||
    col === -1 || col === this.cols;
};

Maze.prototype.crushWall = function (row, col, dir) {
  switch (dir) {
    case Maze.DOWN:
    case Maze.RIGHT:
      this.grid[row][this.colShift(col)] ^=
        dir << this.bitShift(col);
      break;
    case Maze.UP:
      this.crushWall(row - 1, col, Maze.DOWN);
      break;
    case Maze.LEFT:
      this.crushWall(row, col -1, Maze.RIGHT);
      break;
  }
};

Maze.prototype.tryToCrush = function () {
  var row = this.cur[0],
      col = this.cur[1],
      dirs = shuffle(Maze.DIRS),
      i, dir, nrow, ncol;

  for (i = 0; i < Maze.DIRS.length; i++) {
    dir  = dirs[i];
    nrow = row + this.rowOffset(dir);
    ncol = col + this.colOffset(dir);
    if (this.outOfBounds(nrow, ncol) || this.visited(nrow, ncol)) {
      continue;
    }

    this.crushWall(row, col, dir);
    this.stack.push([row, col]);
    return [nrow, ncol];
  }

  return null;
};

Maze.prototype.visit = function () {
  //try to forge a new path
  var newCur = this.tryToCrush(),
      oldCur = this.cur;

  if (newCur !== null) {
    var changed = [this.cur, newCur];
    this.cur = newCur;

    return changed;
  }

  //backtrack
  if (this.stack.length > 0) {
    this.cur = this.stack.pop();
    return [this.cur, oldCur];
  }

  return null;
};

Maze.prototype.finishedBuilding = function () {
  return this.cur[0] === this.start[0] &&
         this.cur[1] === this.start[1];
};
