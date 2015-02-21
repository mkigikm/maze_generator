var c;

function setup () {
  var rows = 60,
      cols = 125,
      maze = new Maze(rows, cols, [0, 0]),
      view = new MazeCanvasView(rows, col, 10, 3,
        document.getElementsByTagName("canvas")[0]);

  c = new MazeController(maze, view);
};

function MazeController (maze, view) {
  this.maze  = maze;
  this.view  = view;
  this.timer = null;

  this.view.refresh(this.maze);
  this.view.refreshCur(this.maze.cur[0], this.maze.cur[1]);
}

MazeController.prototype.step = function () {
  var changed = this.maze.visit();
  this.view.refresh(this.maze);
};

MazeController.prototype.go = function () {
  if (this.timer === null) {
    this.step();
    this.timer = setInterval(function () {
        this.step();

        if (this.maze.finishedBuilding()) {
          clearInterval(this.timer);
        }
      }.bind(this), 1);
  }
};

MazeController.prototype.stop = function () {
  clearInterval(this.timer);
};
