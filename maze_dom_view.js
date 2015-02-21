function MazeView (parent, rows, cols) {
  this.cells = new Array(rows);

  for (var i = 0; i < rows; i++) {
    this.cells[i] = new Array(cols);

    for (var j = 0; j < cols; j++) {
      this.cells[i][j] = new CellView(parent, i +"," + j);
    }
  }
}

MazeView.prototype.refreshCell = function (maze, cell) {
  var i = cell[0];
  var j = cell[1];
  this.cells[i][j].update(maze, i, j);
};

MazeView.prototype.updateCur = function (cur) {
  this.cells[cur[0]][cur[1]].div.className += " current";
};

MazeView.prototype.update = function (maze) {
  for (var i = 0; i < maze.rows; i++) {
    for (var j = 0; j < maze.cols; j++) {
      this.cells[i][j].update(maze, i, j);
    }
  }

  this.updateCur(maze.cur);
};

function CellView (parent, id) {
  this.div = document.createElement("div");
  this.div.id = id;
  this.div.className = "urdl";
  parent.appendChild(this.div);
}

CellView.prototype.update = function (maze, row, col) {
  var className = "";

  if (maze.upWall   (row, col)) className += "u";
  if (maze.rightWall(row, col)) className += "r";
  if (maze.downWall (row, col)) className += "d";
  if (maze.leftWall (row, col)) className += "l";

  if (className === "")
    className = "nowalls";

  this.div.className = className;
};
