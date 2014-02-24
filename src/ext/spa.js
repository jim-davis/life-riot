//  Split your single-page application (SPA) into loosely-coupled modules

var instance;					// the model

// extensions access the model via top.life()
// If called with one arg 
//   If the arg is a function, add a new module that observes the model
//   else create and initialize the model using the arg as configuration
// If called with no arg, return the instance.

top.life = $.observable(function(arg) {
	if (!arg) {
		return instance;
	} else {
		if ($.isFunction(arg)) {
			top.life.on("ready", arg);
		} else {
			instance = new Board(arg);
			top.life.trigger("ready", instance);
		}
    }
});

