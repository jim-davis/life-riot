
// register a callback for after the board object is created
life(function (board) {

	var lastStartTime = null;
	var rollingAverage = new RollingAverage({nPoints: 3});

	// Display the grid as an HTML table.  (It might well be faster to use a Canvas?)

	// create the HTML that displays the grid.
	function makeTable (r, c) {
		var s = "<table class='grid' id='board' border='1' cellpadding='0' cellspacing='0' bordercolor='#DDDDDD'>";
		for (var i = 0; i < r; i++) {
			s += "<tr>";
			for (var j = 0; j < c; j++) {
				s += "<td>" + "&nbsp;" + "</td>";
			}
			s += "</tr>";
		}
		s += "</table>";
		return s;
	}

	function draw_grid () {

		// Draw the table in the holder
		$("#grid_holder").html(makeTable(board.nRows, board.nColumns));

		// jquery event: clicking a cell toggles state.
		$("#board").on("click", "td", function toggleCell (e) {
			var col = $(this).parent().children().index($(this));
			var row = $(this).parent().parent().children().index($(this).parent());
			board.toggleCell(row, col);
		});
	}

	draw_grid();
	$("#framerate").val("");
	$("#nrows").val(board.nRows);
	$("#ncols").val(board.nColumns);

	// riot event: when a cell changes state
	board.on("cell", function (r, c, s) {
		var cell = 	$("#board tbody tr").eq(r).children().eq(c);
		if (s) {
			cell.addClass("live");
			cell.removeClass("dead");
		} else {
			cell.addClass("dead");
			cell.removeClass("live");
		}
	});

	// jquery event: clicked on Step button
	$("#step").on("click", function (e) {
		board.step();
	});

	// riot event: a step is done
	board.on("step", function (n) {
		$("#count").val(n);
		if (board.running) {
			if (lastStartTime) {
				rollingAverage.add(new Date() - lastStartTime);
			}
			lastStartTime = new Date();
		}
	});

	// jquery event, clicked on Run/Stop button
	$("#run").on("click", function (e) {
		if (board.running) {
			board.stop();
		} else {
			rollingAverage.clear();
			lastStartTime = new Date();
			board.run();
		}
	});

	board.on("before:run", function () {
		$("#run").val("Stop");
		rollingAverage.clear();
	});

	board.on("after:run", function () {
		$("#run").val("Run");
	});

	rollingAverage.on("average", function (mean) {
		$("#framerate").val((1000 / mean).toFixed(2));
	});

	$("#clear").on("click", function (e) {
		if (board.running) {
			board.stop();
		}
		board.clear();
	});

	$("#resize").on("click", function (e) {
		if (board.running) {
			board.stop();
		}
		if ($("#ncols").val() > 0 && $("#nrows").val() > 0) {
			board.resize(Number($("#nrows").val()), Number($("#ncols").val()));
		}
	});

	board.on("resize", function (r, c) {
		draw_grid();
	});

});
