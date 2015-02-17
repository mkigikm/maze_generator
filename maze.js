function Maze (rows, cols, row, col) {
  this.UP    = 1;
  this.RIGHT = 2;
  this.DOWN  = 4;
  this.LEFT  = 8;
  this.UNVISITED = 0xf;

  this.sample_dirs = [
    [this.UP, this.DOWN, this.LEFT, this.RIGHT],
    [this.UP, this.DOWN, this.RIGHT, this.LEFT],
    [this.UP, this.LEFT, this.DOWN, this.RIGHT],
    [this.UP, this.LEFT, this.RIGHT, this.DOWN],
    [this.UP, this.RIGHT, this.DOWN, this.LEFT],
    [this.UP, this.RIGHT, this.LEFT, this.DOWN],


    [this.UP, this.DOWN, this.LEFT, this.RIGHT],
    [this.UP, this.DOWN, this.RIGHT, this.LEFT],
    [this.UP, this.LEFT, this.DOWN, this.RIGHT],
    [this.UP, this.LEFT, this.RIGHT, this.DOWN],
    [this.UP, this.RIGHT, this.DOWN, this.LEFT],
    [this.UP, this.RIGHT, this.LEFT, this.DOWN],


    [this.UP, this.DOWN, this.LEFT, this.RIGHT],
    [this.UP, this.DOWN, this.RIGHT, this.LEFT],
    [this.UP, this.LEFT, this.DOWN, this.RIGHT],
    [this.UP, this.LEFT, this.RIGHT, this.DOWN],
    [this.UP, this.RIGHT, this.DOWN, this.LEFT],
    [this.UP, this.RIGHT, this.LEFT, this.DOWN],


    [this.UP, this.DOWN, this.LEFT, this.RIGHT],
    [this.UP, this.DOWN, this.RIGHT, this.LEFT],
    [this.UP, this.LEFT, this.DOWN, this.RIGHT],
    [this.UP, this.LEFT, this.RIGHT, this.DOWN],
    [this.UP, this.RIGHT, this.DOWN, this.LEFT],
    [this.UP, this.RIGHT, this.LEFT, this.DOWN],

    [this.DOWN, this.UP, this.LEFT, this.RIGHT],
    [this.DOWN, this.UP, this.RIGHT, this.LEFT],
    [this.DOWN, this.LEFT, this.UP, this.RIGHT],
    [this.DOWN, this.LEFT, this.RIGHT, this.UP],
    [this.DOWN, this.RIGHT, this.UP, this.LEFT],
    [this.DOWN, this.RIGHT, this.LEFT, this.UP],

    [this.LEFT, this.DOWN, this.UP, this.RIGHT],
    [this.LEFT, this.DOWN, this.RIGHT, this.UP],
    [this.LEFT, this.UP, this.DOWN, this.RIGHT],
    [this.LEFT, this.UP, this.RIGHT, this.DOWN],
    [this.LEFT, this.RIGHT, this.DOWN, this.UP],
    [this.LEFT, this.RIGHT, this.UP, this.DOWN],


    [this.RIGHT, this.DOWN, this.LEFT, this.UP],
    [this.RIGHT, this.DOWN, this.UP, this.LEFT],
    [this.RIGHT, this.LEFT, this.DOWN, this.UP],
    [this.RIGHT, this.LEFT, this.UP, this.DOWN],
    [this.RIGHT, this.UP, this.DOWN, this.LEFT],
    [this.RIGHT, this.UP, this.LEFT, this.DOWN],


    [this.RIGHT, this.DOWN, this.LEFT, this.UP],
    [this.RIGHT, this.DOWN, this.UP, this.LEFT],
    [this.RIGHT, this.LEFT, this.DOWN, this.UP],
    [this.RIGHT, this.LEFT, this.UP, this.DOWN],
    [this.RIGHT, this.UP, this.DOWN, this.LEFT],
    [this.RIGHT, this.UP, this.LEFT, this.DOWN],

    [this.RIGHT, this.DOWN, this.LEFT, this.UP],
    [this.RIGHT, this.DOWN, this.UP, this.LEFT],
    [this.RIGHT, this.LEFT, this.DOWN, this.UP],
    [this.RIGHT, this.LEFT, this.UP, this.DOWN],
    [this.RIGHT, this.UP, this.DOWN, this.LEFT],
    [this.RIGHT, this.UP, this.LEFT, this.DOWN],


    [this.RIGHT, this.DOWN, this.LEFT, this.UP],
    [this.RIGHT, this.DOWN, this.UP, this.LEFT],
    [this.RIGHT, this.LEFT, this.DOWN, this.UP],
    [this.RIGHT, this.LEFT, this.UP, this.DOWN],
    [this.RIGHT, this.UP, this.DOWN, this.LEFT],
    [this.RIGHT, this.UP, this.LEFT, this.DOWN]
  ];

  this.opposite = [];
  this.opposite[this.UP]    = this.DOWN;
  this.opposite[this.DOWN]  = this.UP;
  this.opposite[this.LEFT]  = this.RIGHT;
  this.opposite[this.RIGHT] = this.LEFT;

  this.row_offset = [];
  this.row_offset[this.UP]    = -1;
  this.row_offset[this.DOWN]  =  1;
  this.row_offset[this.LEFT]  =  0;
  this.row_offset[this.RIGHT] =  0;

  this.col_offset = [];
  this.col_offset[this.UP]    =  0;
  this.col_offset[this.DOWN]  =  0;
  this.col_offset[this.LEFT]  = -1;
  this.col_offset[this.RIGHT] =  1;

  this.grid = new Array(rows);
  this.rows = rows;
  this.cols = cols;

  for (var i = 0; i < rows; i++) {
    this.grid[i] = new Array(cols);

    for (var j = 0; j < cols; j++)
      this.grid[i][j] = this.UNVISITED;
  }

  this.init_maze_building(row, col);
}

Maze.prototype.out_of_rows = function(row) {
  return row === -1 || row === this.rows;
};

Maze.prototype.out_of_cols = function(col) {
  return col === -1 || col === this.cols;
};

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
  this.unvisited = new SamplingSet();

  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.cols; j++) {
      if (i === row && j === col)
        continue;

      this.unvisited.add(this.cell_to_string([i, j]));
    }
  }
  console.log(this.unvisited.set);
};

Maze.prototype.try_to_crush = function () {
  var dirs = shuffle([this.UP, this.DOWN, this.LEFT, this.RIGHT]);
  var row = this.cur[0];
  var col = this.cur[1];

  // dirs = this.sample_dirs[~~(this.sample_dirs.length * Math.random())];

  for (var dir of dirs) {
    var nrow = row + this.row_offset[dir];
    var ncol = col + this.col_offset[dir];

    if (this.out_of_rows(nrow) || this.out_of_cols(ncol))
      continue;

    var walls = this.grid[nrow][ncol];
    if (walls != this.UNVISITED)
      continue;

    this.crush_wall(row, col, dir);
    this.unvisited.delete(this.cell_to_string([nrow, ncol]));
    this.stack.push([row, col]);

    return [nrow, ncol];
  }

  return null;
};

Maze.prototype.cell_to_string = function (cell) {
  return cell[0] + "," + cell[1];
};

Maze.prototype.string_to_cell = function (cell) {
  return cell.split(",").map(
    function (i) {
      return Number(i);
    }
  );
};

Maze.prototype.visit = function () {
  //try to forge a new path
  var new_cur = this.try_to_crush();
  if (new_cur != null) {
    var changed = [this.cur, new_cur];
    this.cur = new_cur;

    return changed;
  }

  //backtrack
  if (this.stack.length > 0) {
    var old_cur = this.cur;
    this.cur = this.stack.pop();
    return [this.cur, old_cur];
  }

  console.log("sample");
  console.log(this.unvisited.size());

  //sample from unexplored area, need to make this connect at some point
  //well, I have to get unvisited working right first :)
  if (this.unvisited.size() > 0) {
    var old_cur = this.cur;
    var new_cur = this.unvisited.sample();
    this.cur = this.string_to_cell(new_cur);
    return [this.cur, old_cur];
  }

  return null;
};

Maze.prototype.finished_building = function () {
  return this.unvisited.size() === 0;
};
