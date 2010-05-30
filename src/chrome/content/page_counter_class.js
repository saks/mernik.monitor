if ('undefined' == typeof(Mernik._PageCounterClass)) {
	(function(globalNamespace){
		//TODO: add support for rambler, zero.kz

		var MernikNamespace = globalNamespace.Mernik,
			supportedIDS = ['unknown', 'loading', 'mernik', 'akavita', 'li', 'mailru'];

		Mernik._PageCounterClass = function(id, params) {
			if (supportedIDS.indexOf(id) == -1)
				throw new Error("Unsupported counter id: " + id)

			this.id          = id;
			this.constructor = Mernik._PageCounterClass;
			this.init(params);
		};

		Mernik._PageCounterClass.prototype = {
			init: function(params) {
				if ('unknown' == this.id) {
					/* unknown state for mernik monitor */
					this.statURL   = undefined;
					this.oncommand = 'void 0';
					this.imageURI  = 'chrome://global/skin/icons/question-16.png';

				} else if ('loading' == this.id) {
					/* loading state for mernik monitor */
					this.statURL   = undefined;
					this.oncommand = 'void 0';
					this.imageURI  = 'chrome://global/skin/icons/loading_16.png';

				} else if ('mernik' == this.id) {
					/* mernik counter */
					this.statURL = 'http://top.mernik.by';

				} else if ('akavita' == this.id) {
					/* akavita counter */
					let siteId  = params.window.AC_ID;

					/* parce site id from page source for old counter version */
					if (!siteId && this.constructor.AKAVITA_RE.test(params.pageHTML)) {
						siteId = this.constructor.AKAVITA_RE.exec(params.pageHTML)[1];
					};

					this.statURL = 'http://stat.akavita.com/stat/stat.pl?id=' + siteId + '&lang=ru';
				} else if ('li' == this.id) {
					this.statURL = 'http://www.liveinternet.ru/stat/' + params.document.location.host
				} else if ('mailru' == this.id) {
					let siteId = this.constructor.MAILRU_RE.exec(params.pageHTML)[1];
					this.statURL = 'http://top.mail.ru/rating?id=' + siteId;
				}
			}

		};

		var couterSearchCriteria = [
			[/mernik\scounter/,        'mernik'],
			[/Akavita\scounter/,      'akavita'],
			[/LiveInternet\scounter/,      'li'],
			[/top\.list\.ru\/counter/, 'mailru']
		];

		Mernik._PageCounterClass.getPageCountes = function(DOMWindow) {
			var _window_ = DOMWindow.wrappedJSObject,
				_document_ = _window_.document,
				pageHTML   = _document_.body.innerHTML,
				counters   = [],
				params     = {window: _window_, document: _document_, pageHTML: pageHTML};

			couterSearchCriteria.forEach(function(array) {
				let re = array[0], id = array[1];

				if (re.test(pageHTML)) {
					try {
						counters.push(new MernikNamespace._PageCounterClass(id, params))
					} catch(error) {
						log("Error accured while adding counter `" + id + '`, ' + error.message)
					}
				};

			})

			return counters
		}



		/* constants */

		Mernik._PageCounterClass.AKAVITA_RE = /lik\?id=(\d+)/;
		Mernik._PageCounterClass.MAILRU_RE = /top\.list\.ru.*id=(\d+)/;

	}(window))
}

