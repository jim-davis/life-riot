#!/usr/bin/env node

require('shelljs/make');

var  header = ";(function(top) {",
  footer = '})(typeof top == "object" ? window : exports);';


// initialize repository
function init() {
  mkdir("-p", "dist");
}

// Make a single file out of everything
function concat() {

	init();

	// riot.js
	var js = cat("bower_components/riotjs/riot.js");

	// api
	js += header + cat("src/model/*.js") + footer;
	
	js += "\n";
	js += cat("src/ext/*.js");

	// ui
	js += "\n";
	js+= cat(["src/gui/*.js"]);

	js.to("dist/main.js");

}

target.concat = concat;

// generate application
target.gen = function() {
  concat();
  cp("-f", "bower_components/jquery/jquery.min.js", "dist");
};



