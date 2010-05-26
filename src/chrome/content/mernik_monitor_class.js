if ('undefined' == typeof(Mernik._MonitorClass)) {
	function log(text) {dump(text); dump("\n")}
	function $(id)     {return document.getElementById(id)}

	Mernik._MonitorClass = function(DOMWindow) {
		this.init(DOMWindow);
	};

	Mernik._MonitorClass.prototype = {

		init: function(DOMWindow) {
			this.resetCounterState()
			this.defaults = {
				counterContainerId: 'Mernik_Image',
				scriptServer: 's3.countby.com'
			};

			this.initListener();

			dump("init mernik monitor\n")
		},

		resetCounterState: function() {
			this.counterState = {
				counterPresents:   false,
				containerPresents: false,
				imageLoaded:       false,
				scriptLoaded:      false,
				siteId:            -1,
				status:            'no'
			};
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
			this._stringbundle = $("mernik-monitor-string-bundle");
			this.window   = DOMWindow.wrappedJSObject;
			this.document = this.window.document;
			this.resetCounterState();
			this.collectInfo();
			this.highlightToolbarButton();
			this.populateToolbarItem();
		},

		highlightToolbarButton: function() {
			var button = $('mernik-monitor-counter-status-on-page'),
				newClass = 'status_' + this.counterState.status;

			button.classList.remove('status_ok');
			button.classList.remove('status_no');
			button.classList.remove('status_wrong');
			button.classList.add(newClass);
		},

		populateToolbarItem: function() {
			var list = $('mernik-monitor-counter-info-popup-list'),
				idPrefix = 'mernik-monitor-counter-info-popup-list-item-',
				srcPrefix = 'chrome://xulschoolhello/skin/',
				uri;


			if (list) {
				uri = srcPrefix + this.counterState.counterPresents + '.png';
				$(idPrefix + 'counterPresents').setAttribute('src', uri);

				uri = srcPrefix + this.counterState.containerPresents + '.png';
				$(idPrefix + 'containerPresents').setAttribute('src', uri);

				uri = srcPrefix + this.counterState.imageLoaded + '.png';
				$(idPrefix + 'imageLoaded').setAttribute('src', uri);

				uri = srcPrefix + this.counterState.scriptLoaded + '.png';
				$(idPrefix + 'scriptLoaded').setAttribute('src', uri);

				var siteIdLabel = $(idPrefix + 'siteId').firstChild;
				siteIdLabel.setAttribute('value', this.counterState.siteId);
			}
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

		getString: function(key) {
			return this._stringbundle.getString('mernik.monitor.' + key);
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

