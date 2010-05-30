if ('undefined' == typeof(Mernik._PageAnalizerClass)) {
	(function(globalNamespace){
		var MernikNamespace = globalNamespace.Mernik;

		function filter(arrayLike, callBack) {
			return Array.prototype.filter.call(arrayLike, callBack);
		}

		MernikNamespace._PageAnalizerClass = function(monitor) {
			this.init(monitor);
			this.constructor = MernikNamespace._PageAnalizerClass;
		}

		MernikNamespace._PageAnalizerClass.prototype = {
			init: function(monitor) {
				this.monitor = monitor;
			},

			/*
			* Analizes page and returns new mernik monitor status
			*/
			getState: function(DOMWindow) {
				var _window_   = DOMWindow.wrappedJSObject,
				    _document_ = _window_.document,
				    newState   = {};

				var self  = this, defaults = this.monitor.defaults,
					scripts = _document_.getElementsByTagName('script'),
					imageContainer = _document_.getElementById(defaults.counterContainerId);


				/* find image container */
				newState.containerPresents = !!imageContainer

				/* find mernik image */
				if (imageContainer && imageContainer.firstChild ||
					!!filter(_document_.images, function(i) {
						return i.src.indexOf(defaults.scriptServer) != -1;
					})[0]) {
					newState.imageLoaded = true;
				} else {
					newState.imageLoaded = false;
				}

				/* find <script> tag with mernik counter */
				newState.scriptLoaded = !!filter(scripts, function(i){
					return (i.src.indexOf(defaults.scriptServer) != -1);
				})[0];

				/* get info from page variables */
				if (_window_.mernik && _window_.mernik.id) {
					newState.siteId = _window_.mernik.id;
				} else {
					newState.siteId = -1;
				};


				/* parse page for mernik counter */
				newState.counterPresents = !!(_document_.body &&
					/mernik\scounter\sstart/.test(_document_.body.innerHTML))

				/* deside about counter status */
				if (newState.siteId &&
						newState.imageLoaded &&
						newState.containerPresents ) {

					newState.toolbarButtonState = 'ok';
				} else if (newState.counterPresents) {
					newState.toolbarButtonState = 'wrong';
				} else {
					newState.toolbarButtonState = 'no';
				};

				return newState;
			}

		} // end of prototype definition

	})(window)
}

