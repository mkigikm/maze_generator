function Maze (rows, cols, start) {
  var row, col;

  this.grid     = new Array(rows);
  this.stack    = [];
  this.cur      = start;
  this.start    = this.cur;
  this.rows     = rows;
  this.cols     = cols;
  this.deadEnds = null;

  this.setupBits();
  for (row = 0; row < rows; row++) {
    this.grid[row] = new Int32Array(this.colShift(cols) + 1);

    for (col = 0; col < cols; col++) {
      this.grid[row][col] = ~0;
    }
  }
};

Maze.prototype.setupBits = function () {
  this.bits        = this.dirs().length / 2 | 0;
  this.cellsPerInt = 32 / this.bits | 0;
  this.shift       = Math.ceil(Math.log(this.bits) / Math.LN2);
  this.mask        = Math.pow(2, this.bits) - 1;

  this.unvisited = 0;
  this.dirs().forEach(function (dir) {
    this.unvisited |= dir;
  }, this);
};

Maze.prototype.outOfBounds = function (row, col) {
  return row < 0 || row >= this.rows ||
    col < 0 || col >= this.cols;
};

Maze.prototype.bitShift = function (col) {
  return (col % this.cellsPerInt) * this.bits;
};

Maze.prototype.colShift = function (col) {
  return col / this.cellsPerInt | 0;
};

Maze.prototype.nativeWall = function (row, col, dir) {
  return (this.grid[row][this.colShift(col)] >> this.bitShift(col)) & dir;
};

Maze.prototype.visited = function (row, col) {
  return this.walls(row, col) !== this.unvisited;
};

Maze.prototype.visit = function () {
  //try to forge a new path
  var newCur = this.tryToCrush();

  if (newCur !== null) {
    return [this.cur = newCur, this.cur];
  }

  //backtrack
  if (this.stack.length > 0) {
    return [this.cur = this.stack.pop(), this.cur];
  }

  return null;
};

Maze.prototype.generate = function () {
  while (!this.finishedBuilding()) {
    this.visit();
  }
};

Maze.prototype.finishedBuilding = function () {
  return this.cur[0] === this.start[0] &&
         this.cur[1] === this.start[1] &&
         this.visited(this.cur[0], this.cur[1]);
};

Maze.prototype.tryToCrush = function () {
  var randomDirs = shuffle(this.dirs()),
      i, crushed;

  for (i = 0; i < randomDirs.length; i++) {
    if (crushed = this.tryDirection(randomDirs[i])) {
      return crushed;
    }
  }

  return null;
};

Maze.prototype.tryDirection = function (dir) {
  var row = this.cur[0], col = this.cur[1],
      nrow = this.rowAdd(row, col, dir),
      ncol = this.colAdd(row, col, dir);

  if (this.outOfBounds(nrow, ncol) || this.visited(nrow, ncol)) {
    return null;
  }

  this.crushWall(row, col, dir);
  this.stack.push([row, col]);
  return [nrow, ncol];
};

Maze.prototype.fillInit = function () {
  var row, col;

  this.deadEnds = [];
  for (row = 0; row < this.rows; row++) {
    for (col = 0; col < this.cols; col++) {
      if (this.isDeadEnd(row, col)) {
        this.deadEnds.push([row, col]);
      }
    }
  }
};

Maze.prototype.isDeadEnd = function (row, col) {
  var count = 0;

  this.wallChecks().forEach(function (wall) {
    if (wall.call(this, row, col)) {
      count += 1;
    }
  }, this);

  return count === this.dirs().length - 1;
};

Maze.prototype.fill = function () {
  var cur;

  this.deadEnds = shuffle(this.deadEnds);
  if (cur = this.deadEnds.pop()) {
    this.fillDeadEnd(cur[0], cur[1]);
  }

  return cur;
};

Maze.prototype.fillDeadEnd = function (row, col) {
  var nrow, ncol;

  this.dirs().forEach(function (dir) {
    this.buildWall(row, col, dir);
    nrow = this.rowAdd(row, col, dir),
    ncol = this.colAdd(row, col, dir);

    if (!this.outOfBounds(nrow, ncol) && this.isDeadEnd(nrow, ncol)) {
      this.deadEnds.push([nrow, ncol]);
    }
  }, this);
};
