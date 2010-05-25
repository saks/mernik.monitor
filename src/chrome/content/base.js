
if ('undefined' == typeof(Mernik)) var Mernik = {};
if ('undefined' == typeof(Mernik.Browser)) Mernik.Browser = {};

/*
* Define constants
*/
Mernik.Browser.NOTIFY_STATE_DOCUMENT = Components.interfaces.nsIWebProgress.NOTIFY_STATE_DOCUMENT;
Mernik.Browser.STATE_IS_WINDOW       = Components.interfaces.nsIWebProgressListener.STATE_IS_WINDOW;
Mernik.Browser.STATE_IS_DOCUMENT     = Components.interfaces.nsIWebProgressListener.STATE_IS_DOCUMENT;
Mernik.Browser.STATE_START           = Components.interfaces.nsIWebProgressListener.STATE_START;
Mernik.Browser.STATE_STOP            = Components.interfaces.nsIWebProgressListener.STATE_STOP;


/*
* Container for all listeners with would be registred
*/
Mernik.Browser._listeners = [];


/*
* Library function to regiser any listener
*/
Mernik.Browser.registerOnloadListener = function(listener, filter) {
	if (!filter) filter = Mernik.Browser.NOTIFY_STATE_DOCUMENT;

	Mernik.Browser._listeners.push([listener, filter])

//	window.getBrowser().addProgressListener(listener , filter);
}


/*
* Library function to unregiser any listener
*/
Mernik.Browser.unregisterOnloadListener = function(listener) {
	/* think about is it neccessary to remove listeners*/
//	window.getBrowser().removeProgressListener(myListener);
}


/*
* Initializes browser all the stuff
*/
Mernik.Browser.init = function() {
	var _browser = window.getBrowser();


	/*
	* Add all registred listeners on window load
	*/
	window.addEventListener("load", function() {

		Mernik.Browser._listeners.forEach(function(i) {
			var listener = i[0], filter = i[1];
			_browser.addProgressListener(listener, filter);
		})

	}, false);


	/*
	* Remove all registred listeners on window unload
	*/
	window.addEventListener("unload", function() {

		Mernik.Browser._listeners.forEach(function(i) {
			var listener = i[0], filter = i[1];
			_browser.removeProgressListener(listener);
		})

	}, false);
}

