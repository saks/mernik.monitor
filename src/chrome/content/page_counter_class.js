if ('undefined' == typeof(Mernik._PageCounterClass)) {
	(function(globalNamespace){
		var MernikNamespace = globalNamespace.Mernik,
			supportedIDS = ['mernik'];

		Mernik._PageCounterClass = function(id, info) {
			if (supportedIDS.indexOf(id) == -1)
				throw new Error("Unsupported counter id: " + id)

			this.id = id;
			this.init(info);
			this.constructor = Mernik._PageCounterClass;
		};

		Mernik._PageCounterClass.prototype = {
			init: function(info) {
				if ('mernik' == this.id) {
					this.name    = 'mernik';
					this.siteId  = info.window.SID;
					this.statURL = 'http://top.mernik.by';
				}
			}

		};

		/* constants */

		Mernik._PageCounterClass.MERNIK_RE = /mernik\scounter\sstart/;

	}(window))
}

