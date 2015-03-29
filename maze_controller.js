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
      row            = 0,
      col            = 0,
      sideLength     = 15,
      wallThickness  = 3,
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
    cols = cols / 2 | 0;
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

  $('#fill').click(function () {
    var fillProportion = parseFloat($('#fillProportion').val());
    fillProportion = Math.min(Math.abs(fillProportion), 1) || 1;
    this.fill(fillProportion);
  }.bind(this));

  $('#placeRoom').click(function () {
    this.placeRoom();
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

MazeController.prototype.fill = function (fillProportion) {
  var fillCount = this.maze.rows * this.maze.cols * fillProportion | 0;

  this.maze.fillInit();
  while (fillCount--) {
    filled = this.maze.fill();
    if (filled) {
      this.view.fill(filled[0], filled[1]);
    }
  }
};

MazeController.prototype.placeRoom = function () {
  var room, roomCount = 9;

  while (roomCount) {
    room = this.maze.placeRoom();
    if (room) {
      roomCount--;
      this.view.placeRoom(room[0], room[1], room[2], room[3]);
    };
  }
};
