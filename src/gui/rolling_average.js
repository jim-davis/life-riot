// public methods
// clear
// add
//
// public events
//  clear
//  average
function RollingAverage (conf) {
	this.self = $.observable(this);
	this.nPoints = conf.nPoints || 5;
	this.clear();

}

RollingAverage.prototype.clear = function () {
	this.points = [];
	this.points.length = this.nPoints;
	this.i = 0;
	this.self.trigger("clear");
};

RollingAverage.prototype.add = function (v) {
	this.points[this.i++] = v;
	if (this.i == this.nPoints) {this.i = 0;}
	if  (this.isValid()) {
		var avg = this.mean();
		this.self.trigger("average", this.mean());
	}
};

RollingAverage.prototype.mean = function () {
	var s = 0;
	for (var ii = 0 ; ii < this.points.length; ii++) {
		s += this.points[ii];
	}
	return s / this.nPoints;
};


RollingAverage.prototype.isValid = function () {
	for (var ii = 0; ii < this.points.length; ii++) {
		if (typeof this.points[ii] == "undefined") {
			return false;
		}
	}
	return true;
};

