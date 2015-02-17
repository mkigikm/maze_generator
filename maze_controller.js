function setup () {
  var maze = new Maze(5, 5, 0, 0);
  c = new MazeController(document.getElementById("maze_area"), maze);
}

function MazeController (parent, maze) {
  this.maze = maze;
  this.view = new MazeView(parent, maze.rows, maze.cols);
  this.timer = null;
}

MazeController.prototype.step = function () {
  var changed = this.maze.visit();
  if (changed === null)
    return null;

  this.view.update_cell(this.maze, changed[0]);
  this.view.update_cell(this.maze, changed[1]);

  this.view.update_cur(this.maze.cur);
};

MazeController.prototype.go = function () {
  if (this.timer === null) {
    this.step();
    var me = this;
    this.timer = setInterval(function () { me.step() }, 100);
  }
}

function MazeView (parent, rows, cols) {
  this.cells = new Array(rows);

  for (var i = 0; i < rows; i++) {
    this.cells[i] = new Array(cols);

    for (var j = 0; j < cols; j++)
      this.cells[i][j] = new CellView(parent, i +"," + j);
  }
}

MazeView.prototype.update_cell = function (maze, cell) {
  var i = cell[0];
  var j = cell[1];

  this.cells[i][j].update(maze.grid[i][j]);
};

MazeView.prototype.update_cur = function (cur) {
  this.cells[cur[0]][cur[1]].div.className += " current";
};

MazeView.prototype.update = function (maze) {
  for (var i = 0; i < maze.rows; i++) {
    for (var j = 0; j < maze.cols; j++)
      this.cells[i][j].update(maze.grid[i][j]);
  }

  this.update_cur(maze.cur);
};

function CellView (parent, id) {
  this.div = document.createElement("div");
  this.div.id = id;
  this.div.className = "urdl";
  parent.appendChild(this.div);
}

CellView.prototype.update = function (value) {
  var UP    = 1;
  var RIGHT = 2;
  var DOWN  = 4;
  var LEFT  = 8;

  var className = "";
  if ((UP & value) === UP)
    className += "u";
  if ((RIGHT & value) === RIGHT)
    className += "r";
  if ((DOWN & value) === DOWN)
    className += "d";
  if ((LEFT & value) === LEFT)
    className += "l";

  if (className === "")
    className = "nowalls";

  this.div.className = className;
};
