if ('undefined' == typeof(Mernik._UIManagerClass)) {
	(function(globalNamespace){
		var MernikNamespace = globalNamespace.Mernik;

		counterStateShortcuts = {
			unknown: {
				counterPresents:    'unknown',
				containerPresents:  'unknown',
				imageLoaded:        'unknown',
				scriptLoaded:       'unknown',
				siteId:             -1,
				toolbarButtonState: 'unknown'
			},

			loading: {
				counterPresents:    'unknown',
				containerPresents:  'unknown',
				imageLoaded:        'unknown',
				scriptLoaded:       'unknown',
				siteId:             -1,
				toolbarButtonState: 'loading'
			}
		},

		pageCountersShortcuts = {
			unknown: [new MernikNamespace._PageCounterClass('unknown', {})],
			loading: [new MernikNamespace._PageCounterClass('loading', {})],
		},

		// all available toolbar button statuses
		availableStatuses = ['no', 'ok', 'loading', 'unknown', 'wrong'];

		MernikNamespace._UIManagerClass = function(monitor) {
			this.init(monitor);
			this.constructor = MernikNamespace._UIManagerClass;
		}

		MernikNamespace._UIManagerClass.prototype = {
			init: function(monitor) {
				this.monitor = monitor;
			},


			/*
			* Updates ui widgets state to fit state was passed
			*
			* state may be String ot Object
			*
			* String: some shortcut as 'loading'
			*
			* Object: contains info about state for each widget
			*/
			setState: function(state) {
				var counterState, pageCounters;

				// rewrite state with predefined state by shortcut
				if ('string' == typeof(state)) {
					counterState = counterStateShortcuts[state];
					pageCounters = pageCountersShortcuts[state];
				} else {
					counterState = state.counterState;
					pageCounters = state.pageCounters;
				}

			 this.highlightToolbarButton(counterState.toolbarButtonState);
			 this.updatePopup(counterState);
			 this.fillCounters(pageCounters);
			},


			highlightToolbarButton: function(state) {
				var button = $('mernik-monitor-counter-status-on-page'),
					newClass = 'status_' + state;

				availableStatuses.forEach(function(status){
					button.classList.remove('status_' + status);
				});

				button.classList.add(newClass);
			},

			/*
			* Updated popup with data object containing all necessary data
			*/
			updatePopup: function(state) {
				var idPrefix = 'mernik-monitor-counter-info-popup-list-item-';

				['counterPresents', 'containerPresents',
					'imageLoaded', 'scriptLoaded'].forEach(function(name){
					$(idPrefix + name).setAttribute('src', imageStateURL(state[name]));
				})

				var siteIdLabel = $(idPrefix + 'siteId').firstChild;
				siteIdLabel.setAttribute('value', state.siteId);
			},


			fillCounters: function(pageCounters) {
				/* remove popup with previos result */
				var toolbarbutton = $('mernik-monitor-page-counters'),
					popupID = 'mernik-monitor-page-counters-container';
				toolbarbutton.removeChild($(popupID));

				/* create new popup for counter links */
				var container = document.createElement('menupopup');
				container.setAttribute('id', popupID);

				/* fill new popup with counter links */
				pageCounters.forEach(function(counter){
					var menuitem = document.createElement('menuitem'),
						image      = document.createElement('image'),
						label      = document.createElement('label'),
						oncommand  = counter.oncommand || ("gBrowser.addTab('" + counter.statURL + "')")
						imageURI   = counter.imageURI || (imageSrcPrefix + counter.name + "_counter_logo.png");

					image.setAttribute('src', imageURI);
					label.setAttribute('value', counter.name);

					menuitem.appendChild(image);
					menuitem.appendChild(label);

					menuitem.setAttribute('oncommand', oncommand);

					container.appendChild(menuitem);
				})

				toolbarbutton.appendChild(container);
			}
		}; // end of Mernik._UIManagerClass.prototype definition


		/*---------------------------
		      utilite functions
		----------------------------*/

		/* just a helper function */
		function $(id) {
			return document.getElementById(id);
		};


		/*
		* Returns uri for state image
		*/
		var imageSrcPrefix = 'chrome://mernik_monitor_dev/skin/';

		function imageStateURL(flag) {
			return imageSrcPrefix + flag + '.png';
		};

	})(window)
} // end of if

