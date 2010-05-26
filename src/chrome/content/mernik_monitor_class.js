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
				scriptLoaded:      false,
				siteId:            null,
				status:            'no'
			};

			this.initListener();

			dump("init mernik monitor\n")
		},

		initListener: function() {
			var self = this;

			this.listener = {
				onStateChange:function(aProgress,aRequest,aFlag,aStatus) {
					//FIXME: get out of hardcoded aFlag value
					if ('786448' == aFlag) {
						self.onDomLoaded(aProgress.DOMWindow);
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
		* Fires when all dom content is loaded
		*/
		onDomLoaded: function(DOMWindow) {
			this.window   = DOMWindow.wrappedJSObject;
			this.document = this.window.document;
			this.collectInfo()
		},

		collectInfo: function(){
			var self  = this, defaults = this.defaults,
				scripts = this.document.getElementsByTagName('script'),
				imageContainer = this.$(defaults.counterContainerId);


			/* find image container */
			if (imageContainer) {
				this.changeCounterState('containerPresents', true);
			}

			/* find mernik image */
			if (imageContainer && imageContainer.firstChild) {
				this.changeCounterState('imageLoaded', true);
			} else if (this.filter(this.document.images, function(i) {
				return i.src.indexOf(defaults.scriptServer) != -1;
			})[0]) {
				this.changeCounterState('imageLoaded', true);
			}


			/* find <script> tag with mernik counter */
			this.mernikScript = this.filter(scripts, function(i){
				return (i.src.indexOf(self.defaults.scriptServer) != -1);
			})[0];

			if (this.mernikScript) {
				this.changeCounterState('scriptLoaded', true);
			};

			/* get info from page variables */
			if (this.window.mernik && this.window.mernik.id) {
				this.changeCounterState('siteId', this.window.mernik.id);
			};


			/* parse page for mernik counter */
			if (/mernik\scounter\sstart/.test(this.document.body.innerHTML)) {
				this.changeCounterState('counterPresents', true);
			};

			/* deside about counter status */
			if (this.counterState.siteId &&
				this.counterState.imageLoaded &&
				this.counterState.containerPresents ) {
					this.changeCounterState('status', 'ok');
			} else if (this.counterState.counterPresents) {
				this.changeCounterState('status', 'wrong');
			};

		},

		changeCounterState: function(key, value) {
			this.counterState[key] = value;
		},

		filter: function(arrayLike, callBack) {
			return Array.prototype.filter.call(arrayLike, callBack);
		},

		$: function(id) {
			return this.document.getElementById(id);
		}

	}; /* end of prototype definition */

};

