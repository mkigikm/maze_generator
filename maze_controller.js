function setup () {
  new MazeController();
};

function MazeController () {
  this.setup();
  this.wireControls();
};

MazeController.prototype.setup = function () {
  var rows           = parseInt($('#rows').val()) || 40,
      cols           = parseInt($('#cols').val()) || 40,
      row            = parseInt($('#start_row').val()) || 0,
      col            = parseInt($('#start_col').val()) || 0,
      sideLength     = parseInt($('#side_length').val()) || 15,
      wallThickness  = parseInt($('#wall_thickness').val()) || 3,
      canvas         = $('#maze_display').get(0);

  this.stop();

  if (row >= rows) {
    row = 0;
  }
  if (col >= cols) {
    col = 0;
  }

  if ($('#square_maze').is(':checked')) {
    this.maze = new SquareMaze(rows, cols, [row, col]);
    this.view = new SquareMazeCanvasView(rows, cols, sideLength, wallThickness,
      canvas);
  } else {
    this.maze = new HexMaze(rows, cols, [row, col]);
    this.view = new HexMazeCanvasView(rows, cols, sideLength, wallThickness,
      canvas);
  }

  this.view.refresh(this.maze);
};

MazeController.prototype.wireControls = function () {
  $('#step').click(function () {
    this.step();
  }.bind(this));

  $('#go').click(function () {
    if (!this.timer) {
      this.go(parseInt($('#delay').val() || 10));
    } else {
      this.stop();
    }
  }.bind(this));

  $('#refresh').click(function () {
    this.setup();
  }.bind(this));

  $('#generate').click(function () {
    this.stop();
    this.generate();
  }.bind(this));
};

MazeController.prototype.tick = function () {
    this.maze.visit();
    this.view.refresh(this.maze);
};

MazeController.prototype.step = function () {
  this.timer || this.tick();
};

MazeController.prototype.go = function (delay) {
  if (this.timer === null) {
    $('#go').text("Stop");
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
  $('#go').text("Go");
  clearInterval(this.timer);
  this.timer = null;
};

MazeController.prototype.generate = function () {
  this.maze.generate();
  this.view.refresh(this.maze);
};
