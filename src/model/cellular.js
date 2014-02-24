// a board for the cellular automata game Life.

// constructor
// r is number of rows, c number of columns
// has two arrays, one for current state (cells), one for next state
// cell state is 0 for dead and 1 for alive.

// methods (public)
//  setCell
//  step
//  run

// messages (events)
//  before:run
//  after:run
//  step (stepCounter)
//  clear
//  cell (r, c, state)
function Board (conf) {
	// make a two-d grid
	function makeGrid (r, c) {
		var a = [];
		a.length = r;
		for (var i = 0; i < r; i++) {
			a[i] = [];
			a[i].length = c;
			for (var j = 0; j < c; j++) {
				a[i][j] = 0;
			}
		}
		return a;
	}

	this.self = $.observable(this);  // riotjs
	$.extend(this.self, conf);       // riotjs
	this.nRows = conf.r;
	this.nColumns = conf.c;
	this.cells = makeGrid(this.nRows, this.nColumns);
	this.next = makeGrid(this.nRows, this.nColumns);
	this.stepCounter = 0;
	this.running = false;
}

// public 
// toggle state of cell
Board.prototype.toggleCell = function (r, c) {
	this.setCell(r, c, this.cells[r][c] === 0 ? 1 : 0);

};

// public
// set the value in cell at r,c to v
Board.prototype.setCell = function (r, c, v) {
	this.cells[r][c] = v;
	this.self.trigger("cell", r, c, this.cells[r][c]);
};

// public
// run one step, setting the cells
Board.prototype.step = function () {
	var v;
	for (var i = 0; i < this.nRows; i++) {
		for (var j = 0; j < this.nColumns; j++) {
			this.next[i][j] = this.nextState(i, j);
		}
	}
	for (var ii = 0; ii < this.nRows; ii++) {
		for (var jj = 0; jj < this.nColumns; jj++) {
			v = this.next[ii][jj];
			this.cells[ii][jj] = v;
			this.self.trigger("cell", ii, jj, v);
		}
	}
	this.stepCounter++;
	this.self.trigger("step", this.stepCounter);
};

Board.prototype.run = function () {
	this.self.trigger("before:run");
	this.running = true;
	while (this.running) {
		this.step();
	}
	this.self.trigger("after:run");
};

Board.prototype.stop = function () {
	this.running = false;
};


// protected
// return the state that cell r, c will have next time
Board.prototype.nextState = function (r, c) {
	var n = this.countNeighbors(r, c);
	// classic Conway rule
	if (n <= 1) {
		return 0;
	} else if (n == 2) {
		return this.isAlive(r,c) ? 1 : 0;
	} else if (n == 3 || n == 4) {
		return 1;
	} else {
		return 0;
	}
};


// protected
// return the number of live neighbor cells.
// Classic Conway rule, neighbors are the eight cells immediately adjacent
Board.prototype.countNeighbors = function (r, c) {
    var counter = 0;
    for (var dr = -1; dr <= 1; dr++) {
        var nr = r + dr;
        if (nr >= 0 && nr < this.nRows) {
            for (var dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) {
                    continue;
                }
                var nc = c + dc;
                if (nc >= 0 && nc < this.nColumns) {
                    if (this.cells[nr][nc] == 1) {
                        counter++;
                    }
                }
            }
        }
    }
    return counter;
};

// protected
// is the cell at r, c alive now?
Board.prototype.isAlive = function (r, c) {
  return this.cells[r][c] == 1;
};


// public
Board.prototype.clear = function () {
	for (var i = 0; i < this.nRows; i++) {
		for (var j = 0; j < this.nColumns; j++) {
			this.cells[i][j] = 0;
		}
	}
	this.self.trigger("clear");
};


top.Board = Board;