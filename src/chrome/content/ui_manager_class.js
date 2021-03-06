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

				if (!(counterState && pageCounters)) {
					log("invalid state was passed:")
					log(state);
					return
				};

				this.highlightToolbarButton(counterState.toolbarButtonState);
				this.updatePopup(counterState);
				this.fillCounters(pageCounters);
			},


			highlightToolbarButton: function(state) {
				var button = $('mernik-monitor-counter-status-on-page'),
					newClass = 'status_' + state;

				//do nothing if there is no button on the toolbar
				if (!button) return;

				availableStatuses.forEach(function(status){
					button.classList.remove('status_' + status);
				});

				button.classList.add(newClass);
			},

			/*
			* Updated popup with data object containing all necessary data
			*/
			updatePopup: function(state) {
				//do nothing if there is no button on the toolbar
				if (!$('mernik-monitor-toolbar-item')) return;

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

				//do nothing if there is no button on the toolbar
				if (!toolbarbutton) return;

				toolbarbutton.removeChild($(popupID));

				/* create new popup for counter links */
				var container = document.createElement('menupopup');
				container.setAttribute('id', popupID);

				/* fill new popup with counter links */
				pageCounters.forEach(function(counter){
					var menuitem = document.createElement('menuitem'),
						bundle     = $('mernik_monitor_dev-string-bundle'),
						image      = document.createElement('image'),
						label      = document.createElement('label'),
						labelValue = counter.id,
						disabled   = (counter.disabled || false),
						oncommand  = (counter.oncommand || ("gBrowser.addTab('" + counter.statURL + "')")),
						imageURI   = (counter.imageURI || (imageSrcPrefix + counter.id + "_counter_logo.png"));

					try {
						labelValue = bundle.getString('mernikMonitor.pageCounters.status.' + counter.id);
					} catch(error) {
						log(error.message);
					};


					image.setAttribute('src', imageURI);
					label.setAttribute('value', labelValue);

					menuitem.appendChild(image);
					menuitem.appendChild(label);

					menuitem.setAttribute('oncommand', oncommand);
					menuitem.setAttribute('disabled', disabled);

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

		function getString(key) {
			$('mernik_monitor_dev-string-bundle').getString(key);
		}

		/*
		* Returns uri for state image
		*/
		var imageSrcPrefix = 'chrome://mernik_monitor_dev/skin/';

		function imageStateURL(flag) {
			return imageSrcPrefix + flag + '.png';
		};

	})(window)
} // end of if

