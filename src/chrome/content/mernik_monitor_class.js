if ('undefined' == typeof(Mernik._MonitorClass)) {
	function log(text) {
		var result = "";

		if ('string' == typeof(text)) {
			result += text
		} else if ('object' == typeof(text)) {
			var pairs = [];
			for (k in text) {
				pairs.push("" + k + ": " + text[k])
			}
			result += ("<" + text.constructor + "> [" + pairs.join(', ') + "]")
		} else {
			result += "unknown type: " + typeof(text)
		};

		dump(result); dump("\n")

	}

	Mernik._MonitorClass = function() {
		this.init();
		this.constructor = Mernik._MonitorClass;
	};

	Mernik._MonitorClass.prototype = {

		init: function() {
			this.ui           = new Mernik._UIManagerClass(this);
			this.pageAnalizer = new Mernik._PageAnalizerClass(this);

			this.defaults = {
				counterContainerId: 'Mernik_Image',
				scriptServer: 's3.countby.com'
			};

			this.initWindowStateListener();
			this.initTabListener();
		},

		initWindowStateListener: function() {
			var self = this;

			this.listener = {
				onStateChange:function(aProgress,aRequest,aFlag,aStatus) {

					if (!!(aFlag & Mernik.Browser.STATE_START) &&
							!!(aFlag & Mernik.Browser.STATE_IS_WINDOW)) {
						//log('START:' + aFlag)
						self.startLoading();
						return
					};

					if (!!(aFlag & Mernik.Browser.STATE_STOP) &&
							!!(aFlag & Mernik.Browser.STATE_IS_WINDOW)) {
						self.onDomReady(aProgress.DOMWindow);
						//log('STOP:' + aFlag)
						return
					};

				},
				onLocationChange:   function(a,b,c) {},
				onProgressChange:   function(a,b,c,d,e,f) {},
				onStatusChange:     function(a,b,c,d) {},
				onSecurityChange:   function(a,b,c) {},
				onLinkIconAvailable:function(a) {}
			}
		},

		/*
		* Inits tab switching listener
		*/
		initTabListener: function() {
			var self = this;
			gBrowser.tabContainer.addEventListener("TabSelect", function(event) {
				var _browser_  = gBrowser.getBrowserForTab(event.target),
					_window_   = _browser_.contentWindow,
					loadingNow = _browser_.webProgress.isLoadingDocument;

				self.xxx = _window_;
				if (loadingNow) {
					if ('about:blank' == _window_.location.href) {
						self.ui.setState('unknown');
					} else {
						self.ui.setState('loading');
					}
				} else {
					self.onDomReady(_window_);
				}
			}, false);
		},

		/*
		* Fires when new page loading started
		*/
		startLoading: function() {
			this.ui.setState('loading');
		},

		/*
		* Fires when all dom content is loaded
		*/
		onDomReady: function(DOMWindow) {
			this.ui.setState(this.pageAnalizer.getState(DOMWindow));
		}

	}; /* end of prototype definition */

};

