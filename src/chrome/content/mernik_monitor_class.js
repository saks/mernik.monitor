if ('undefined' == typeof(Mernik._MonitorClass)) {
	function log(text) {dump(text); dump("\n")}

	Mernik._MonitorClass = function(DOMWindow) {
		this.init(DOMWindow);
	};

	Mernik._MonitorClass.prototype = {

		init: function(DOMWindow) {
			this.defaults = {
				counterContainerId: 'Mernik_Image',
				scriptServer: 's3.countby.com'
			};

			this.counterState = {
				counterPresents:   false,
				containerPresents: false,
				imageLoaded:       false,
				scriptLoaded:      false
			};

			this.window   = DOMWindow;
			this.document = this.window.document;
			this.findMernikCounter()
			dump("init mernik monitor\n")
		},

		findMernikCounter: function(){
			var self  = this, defaults = this.defaults,
				scripts = this.document.getElementsByTagName('script'),
				imageContainer = this.$(defaults.counterContainerId);


			/* find image container */
			if ('undefined' != typeof(imageContainer)) {
				this.changeCounterState('containerPresents', true);
			}

			/* find mernik image */
			if (imageContainer && imageContainer.firstChild) {
				this.changeCounterState('imageLoaded', true);
			}


			/* find <script> tag with mernik counter */
			this.mernikScript = Array.prototype.filter.call(scripts, function(i){
				return (i.src.indexOf(self.defaults.scriptServer) != -1);
			});

			if (this.mernikScript) {
				this.changeCounterState('scriptLoaded', true);
			};

		},

		changeCounterState: function(key, value) {
			this.counterState[key] = value;
		},

		$: function(id) {
			return this.document.getElementById(id);
		}

	}; /* end of prototype definition */

};

