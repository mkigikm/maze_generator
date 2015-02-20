function Maze (rows, cols, row, col) {
  this.grid = new Array(rows);
  this.rows = rows;
  this.cols = cols;

  for (var i = 0; i < rows; i++) {
    this.grid[i] = new Int32Array(this.colShift(cols) + 1);

    for (var j = 0; j < this.colShift(cols) + 1; j++) {
      this.grid[i][j] = ~0;
    }
  }

  this.stack = [];
  this.cur   = [row, col];
  this.start = this.cur;
}

Maze.DOWN  = 1;
Maze.RIGHT = 2;
Maze.UP    = 4;
Maze.LEFT  = 8;

Maze.DIRS = [Maze.DOWN, Maze.RIGHT, Maze.UP, Maze.LEFT];

Maze.UNVISITED = Maze.DOWN | Maze.RIGHT | Maze.UP | Maze.LEFT;

Maze.CELLS_PER_INT = 16;

Maze.prototype.rowOffset = function (dir) {
  if ((dir & (Maze.LEFT | Maze.RIGHT)) > 0) {
    return 0;
  } else if (dir === Maze.DOWN) {
    return 1;
  } else {
    return -1;
  }
};

Maze.prototype.colOffset = function (dir) {
  if ((dir & (Maze.UP | Maze.DOWN)) > 0) {
    return 0;
  } else if (dir === Maze.RIGHT) {
    return 1;
  } else {
    return -1;
  }
};

Maze.prototype.bitShift = function (col) {
  return (col % Maze.CELLS_PER_INT) * 2;
};

Maze.prototype.colShift = function (col) {
  return ~~(col / Maze.CELLS_PER_INT);
}

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
  var row = this.cur[0];
  var col = this.cur[1];
  var dirs = shuffle(Maze.DIRS);

  for (var i = 0; i < dirs.length; i++) {
    var dir  = dirs[i];
    var nrow = row + this.rowOffset(dir);
    var ncol = col + this.colOffset(dir);
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
  var newCur = this.tryToCrush();
  if (newCur !== null) {
    var changed = [this.cur, newCur];
    this.cur = newCur;

    return changed;
  }

  console.log("backtracking")

  //backtrack
  if (this.stack.length > 0) {
    var oldCur = this.cur;
    this.cur = this.stack.pop();
    return [this.cur, oldCur];
  }

  return null;
};

Maze.prototype.finishedBuilding = function () {
  return this.cur[0] === this.start[0] && this.cur[1] === this.start[1];
};
