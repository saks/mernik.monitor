if ('undefined' == typeof(Mernik._PageCounterClass)) {
	(function(globalNamespace){
		var MernikNamespace = globalNamespace.Mernik,
			supportedIDS = ['mernik', 'akavita'];

		Mernik._PageCounterClass = function(id, params) {
			if (supportedIDS.indexOf(id) == -1)
				throw new Error("Unsupported counter id: " + id)

			this.id = id;
			this.init(params);
			this.constructor = Mernik._PageCounterClass;
		};

		Mernik._PageCounterClass.prototype = {
			init: function(params) {
				if ('mernik' == this.id) {
					this.name    = 'mernik';
					this.siteId  = params.window.SID;
					this.statURL = 'http://top.mernik.by';
				} else if ('akavita' == this.id) {
					this.name    = 'akavita';
					this.siteId  = params.window.AC_ID;

					/* parce site id from page source for old counter version */
					var re = /lik\?id=(\d+)/
					if (!this.siteId && re.test(params.pageHTML)) {
						this.siteId = re.exec(params.pageHTML)[1];
					};

					this.statURL = 'http://stat.akavita.com/stat/stat.pl?id=' + this.siteId + '&lang=ru';
				}
			}

		};

		/* constants */

		Mernik._PageCounterClass.MERNIK_RE = /mernik\scounter\sstart/;
		Mernik._PageCounterClass.AKAVITA_RE = /Akavita\scounter/;

	}(window))
}

