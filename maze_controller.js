var c;

function setup () {
  c = new MazeController();
};

function MazeController () {
  this.setup();
};

MazeController.prototype.setup = function () {
  var rows        = parseInt($('#rows').val()),
      cols        = parseInt($('#cols').val()),
      row         = parseInt($('#start_row').val()),
      col         = parseInt($('#start_col').val()),
      squareWidth = parseInt($('#square_width').val()),
      wallWidth   = parseInt($('#wall_width').val());

  this.stop();
  // this.maze = new SquareMaze(rows, cols, [row, col]);
  // this.view = new SquareMazeCanvasView(rows, cols, squareWidth, wallWidth,
  //   $('#maze_display').get(0));
  this.maze = new HexMaze(10, 10, [row, col]);
  this.view = new HexMazeCanvasView(10, 10, squareWidth, wallWidth,
    $('#maze_display').get(0));
  console.log(rows, cols, squareWidth, wallWidth)
  console.log(row, col)

  this.view.refresh(this.maze);
  this.view.refreshCur(row, col);
}

MazeController.prototype.tick = function () {
    this.maze.visit();
    this.view.refresh(this.maze);
};

MazeController.prototype.step = function () {
  this.timer || this.tick();
};

MazeController.prototype.go = function () {
  var delay = parseInt($('#delay').val());

  if (this.timer === null) {
    this.tick();
    this.timer = setInterval(function () {
        this.tick();

        if (this.maze.finishedBuilding()) {
          clearInterval(this.timer);
          this.timer = null;
        }
      }.bind(this), delay);
  }
};

MazeController.prototype.stop = function () {
  clearInterval(this.timer);
}

MazeController.prototype.stop = function () {
  clearInterval(this.timer);
  this.timer = null;
};
