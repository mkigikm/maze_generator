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

Maze.prototype.outOfBounds = function (row, col) {
  return row === -1 || row === this.rows ||
    col === -1 || col === this.cols;
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

Maze.prototype.tryToCrush = function () {
  var row = this.cur[0],
      col = this.cur[1],
      randomDirs = shuffle(this.dirs()),
      i, dir, nrow, ncol;

  for (i = 0; i < randomDirs.length; i++) {
    dir  = randomDirs[i];
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
