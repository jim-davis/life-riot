// register a callback for after the board object is created
life(function (board) {

	// create the HTML that displays the grid.
	// It might well be faster to use a Canvas.
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

	// draw the table
	$("#grid_holder").html(makeTable(board.nRows, board.nColumns));

	// jquery event: clicking a cell toggles state.
	$("#board").on("click", "td", function toggleCell (e) {
		var col = $(this).parent().children().index($(this));
		var row = $(this).parent().parent().children().index($(this).parent());
		board.toggleCell(row, col);
	});

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
	});

	// jquery event, clicked on Run/Stop button
	$("#run").on("click", function (e) {
		if (board.running) {
			board.stop();
		} else {
			board.run();
		}
	});

	board.on("before:run", function () {
		$("#run").val("Stop");
	});

	board.on("after:run", function () {
		$("#run").val("Run");
	});

});
