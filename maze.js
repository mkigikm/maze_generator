function Maze (rows, cols) {
  this.grid = new Array(rows);
  this.rows = rows;
  this.cols = cols;

  this.UP = 1;
  this.RIGHT = 2;
  this.DOWN = 4;
  this.LEFT = 8;
  this.UNVISITED = 0xf;

  this.opposite = {
    this.UP: this.DOWN,
    this.DOWN: this.UP,
    this.LEFT: this.RIGHT,
    this.RIGHT: this.LEFT
  }

  this.row_offset = {
    this.UP:   -1,
    this.DOWN:  1,
    this.LEFT:  0,
    this.RIGHT: 0
  }

  this.col_offset = {
    this.UP:    0,
    this.DOWN:  0,
    this.LEFT: -1,
    this.RIGHT: 1
  }

  for (var i; i < rows; i++) {
    this.grid[i] = new Array(cols);

    for (var j; j < cols; j++)
      this.grid[i][j] = this.UNVISITED;
  }
}

Maze.prototype.out_of_rows = function(row) {
  row < 0 || row >= this.rows;
};

Maze.prototype.out_of_cols = function(col) {
  col < 0 || col >= this.cols;
};

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

Maze.prototype.crush_wall = function (row, col, dir) {
  var nrow = row + this.row_offset[dir];
  var ncol = col + this.col_offset[dir];

  if (this.out_of_rows(nrow) || this.out_of_cols(ncol))
    return;

  this.grid[row][col]   = this.grid[row][col] ^ dir;
  this.grid[nrow][ncol] = this.grid[nrow][ncol] ^ this.opposite[dir];
};

Maze.prototype.init_maze_building = function (row, col) {
  this.cur = [row, col];
  this.stack = [];

  this.unvisited = [];

  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.col; j++) {
      if (i === row && j === col)
        continue;

      this.unvisited.push(i + "," + j);
    }
  }
  shuffleArray(this.unvisited);
};

Maze.prototype.try_to_crush = function () {
  var dirs = shuffleArray([this.UP, this.DOWN, this.LEFT, this.RIGHT]);
  var row = this.cur[0];
  var col = this.cur[1];

  for (var dir of dirs) {
    var nrow = row + this.row_offset[dir];
    var ncol = col + this.col_offset[dir];

    if (this.out_of_rows(nrow) || this.out_of_cols(ncol))
      continue;

    var walls = this.grid[nrow][ncol];
    if (walls != this.UNVISITED)
      continue;

    this.crush_wall(row, col, dir);
    this.mark_visited(nrow, ncol);
    var to_del = this.unvisited.indexOf(nrow + "," + ncol);
    this.unvisited.splice(to_del, 1);
    this.stack.push([row, col]);
    this.cur = [nrow, ncol];
    return this.cur;
  }

  return null;
};

Maze.prototype.visit = function() {
  var new_cur = this.try_to_crush();
  if (new_cur != null)
    return new_cur;

  if (this.stack.length > 0) {
    this.cur = this.stack.pop();
    return this.cur
  }

  if (this.unvisited.length > 0)
    this.cur = this.unvisited.pop().split(",").map(
      function (i) {
        return Number(i);
      }
    );
    return this.cur;
  }

  return null;
};
