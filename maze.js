function Maze (rows, cols, row, col) {
  this.DOWN  = 1;
  this.RIGHT = 2;
  this.UP    = 4;
  this.LEFT  = 8;

  this.grid = new Array(rows);
  this.rows = rows;
  this.cols = cols;

  for (var i = 0; i < rows; i++) {
    this.grid[i] = new Array(cols);

    for (var j = 0; j < cols; j++) {
      this.grid[i][j] = this.DOWN | this.RIGHT;
    }
  }

  this.stack = [];
  this.cur = [row, col];
}

Maze.prototype.rowOffset = function (dir) {
  if ((dir & (this.LEFT | this.RIGHT)) > 0) {
    return 0;
  } else if (dir === this.DOWN) {
    return 1;
  } else {
    return -1;
  }
};

Maze.prototype.colOffset = function (dir) {
  if ((dir & (this.UP | this.DOWN)) > 0) {
    return 0;
  } else if (dir === this.RIGHT) {
    return 1;
  } else {
    return -1;
  }
};

Maze.prototype.downWall = function (row, col) {
  return this.grid[row][col] & this.DOWN;
};

Maze.prototype.upWall = function (row, col) {
  if (row === 0) {
    return this.UP;
  }
  return this.downWall(row - 1, col) << 2;
};

Maze.prototype.rightWall = function (row, col) {
  return this.grid[row][col] & this.RIGHT;
};

Maze.prototype.leftWall = function (row, col) {
  if (col === 0) {
    return this.LEFT;
  }
  return this.rightWall(row, col - 1) << 2;
};

Maze.prototype.visited = function (row, col) {
  return this.walls(row, col) !== (this.UP | this.DOWN | this.LEFT | this.RIGHT);
};

Maze.prototype.walls = function (row, col) {
  return this.downWall(row, col) | this.upWall(row, col) |
    this.leftWall(row, col) | this.rightWall(row, col);
};

Maze.prototype.outOfBounds = function (row, col) {
  return row === -1 || row === this.rows || col === -1 || col === this.cols;
};

Maze.prototype.crushWall = function (row, col, dir) {
  switch (dir) {
    case this.DOWN:
    case this.RIGHT:
      this.grid[row][col] ^= dir;
      break;
    case this.UP:
      this.grid[row - 1][col] ^= this.DOWN;
      break;
    case this.LEFT:
      this.grid[row][col - 1] ^= this.RIGHT;
      break;
  }
};

Maze.prototype.tryToCrush = function () {
  var dirs = shuffle([this.UP, this.RIGHT, this.DOWN, this.LEFT]);
  var row = this.cur[0];
  var col = this.cur[1];

  for (var dir of dirs) {
    var nrow = row + this.rowOffset(dir);
    var ncol = col + this.colOffset(dir);

    if (this.outOfBounds(nrow, ncol) || this.visited(nrow, ncol)) {
      continue;
    }

    this.crushWall(row, col, dir);
    this.stack.push([row, col])
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

  //backtrack
  if (this.stack.length > 0) {
    var oldCur = this.cur;
    this.cur = this.stack.pop();
    return [this.cur, oldCur];
  }

  return null;
};

Maze.prototype.finishedBuilding = function () {
  return this.cur[0] === 0 && this.cur[1] === 0 &&
    this.grid[0][0] !== (this.DOWN | this.RIGHT)
};

Maze.prototype.displayWalls = function () {
  for (var i = 0; i < this.rows; i++)
    for (var j = 0; j < this.cols; j++)
      console.log(this.walls(i, j))
};
