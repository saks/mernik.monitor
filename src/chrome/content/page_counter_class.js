if ('undefined' == typeof(Mernik._PageCounterClass)) {
	(function(globalNamespace){
		var MernikNamespace = globalNamespace.Mernik,
			supportedIDS = ['unknown', 'loading', 'mernik', 'akavita'];

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
					this.name    = 'unknown'
					this.siteId  = -1;
					this.statURL = '';

				} else if ('loading' == this.id) {
					/* loading state for mernik monitor */
					this.name    = 'loading'
					this.siteId  = -1;
					this.statURL = '';

				} else if ('mernik' == this.id) {
					/* mernik counter */
					this.name    = 'mernik';
					this.siteId  = params.window.SID;
					this.statURL = 'http://top.mernik.by';

				} else if ('akavita' == this.id) {
					/* akavita counter */
					this.name    = 'akavita';
					this.siteId  = params.window.AC_ID;

					/* parce site id from page source for old counter version */
					if (!this.siteId && this.constructor.AKAVITA_RE1.test(params.pageHTML)) {
						this.siteId = this.constructor.AKAVITA_RE1.exec(params.pageHTML)[1];
					};

					this.statURL = 'http://stat.akavita.com/stat/stat.pl?id=' + this.siteId + '&lang=ru';
				}
			}

		};

		/* constants */

		Mernik._PageCounterClass.MERNIK_RE   = /mernik\scounter\sstart/;
		Mernik._PageCounterClass.AKAVITA_RE  = /Akavita\scounter/;
		Mernik._PageCounterClass.AKAVITA_RE1 = /lik\?id=(\d+)/;

	}(window))
}

