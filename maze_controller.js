function setup () {
  var maze = new Maze(20, 60, 0, 0);
  c = new MazeController(document.getElementById("maze_area"), maze);
}

function MazeController (parent, maze) {
  this.maze = maze;
  this.view = new MazeView(parent, maze.rows, maze.cols);
  this.timer = null;
}

MazeController.prototype.step = function () {
  this.maze.visit();
  this.view.update(this.maze);
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
      this.cells[i][j] = new CellView(parent);
  }
}

MazeView.prototype.update = function (maze) {
  for (var i = 0; i < maze.rows; i++) {
    for (var j = 0; j < maze.cols; j++)
      this.cells[i][j].update(maze.grid[i][j]);
  }

  this.cells[maze.cur[0]][maze.cur[1]].div.className += " current";
};

function CellView (parent) {
  this.div = document.createElement("div");
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

  this.div.className = className;
};
