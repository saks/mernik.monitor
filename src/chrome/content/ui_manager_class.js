if ('undefined' == typeof(Mernik._UIManagerClass)) {
	(function(globalNamespace){
		var MernikNamespace = globalNamespace.Mernik;

		stateShortcuts = {
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
				//log(state)
				if (!$('mernik-monitor-toolbar-item')) {
					//log('no toolbaritem')
					return;
				}

				// rewrite state with predefined state by shortcut
				if ('string' == typeof(state)) state = stateShortcuts[state];

				//return if no state was passed or not valid shortcut used
				if (!state) {
					//log("invalid state passed to ui.setState: " + state);
					return;
				}

			 this.highlightToolbarButton(state.toolbarButtonState);
			 this.updatePopup(state)
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
						imageURI   = imageSrcPrefix + counter.name + "_counter_logo.png";

					image.setAttribute('src', imageURI);
					label.setAttribute('value', counter.name);

					menuitem.appendChild(image);
					menuitem.appendChild(label);

					menuitem.setAttribute('oncommand', "gBrowser.addTab('" + counter.statURL + "')");

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

