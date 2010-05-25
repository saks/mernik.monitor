/**
 * XULSchoolChrome namespace.
 */
if ("undefined" == typeof(XULSchoolChrome)) {
  var XULSchoolChrome = {};
};

/**
 * Controls the browser overlay for the Hello World extension.
 */
XULSchoolChrome.BrowserOverlay = {
	init: function(e) {
		dump('onlload fired!')
	},

  /**
   * Says 'Hello' to the user.
   */
  sayHello : function(aEvent) {
    let stringBundle = document.getElementById("xulschoolhello-string-bundle");
    let message = stringBundle.getString("xulschoolhello.greeting.label");

    window.alert(message);
  }
}


var myListener = {
	onStateChange:function(aProgress,aRequest,aFlag,aStatus) {
		if ('786448' == aFlag &&
			(aFlag & (Mernik.Browser.STATE_IS_DOCUMENT|Mernik.Browser.STATE_STOP))) {
			//DO ALL THE WORK after ONLOAD
			Mernik.Monitor = new Mernik._MonitorClass(aProgress.DOMWindow);
		};
	},
	onLocationChange:   function(a,b,c) {},
	onProgressChange:   function(a,b,c,d,e,f) {},
	onStatusChange:     function(a,b,c,d) {},
	onSecurityChange:   function(a,b,c) {},
	onLinkIconAvailable:function(a) {}
}

Mernik.Browser.registerOnloadListener(myListener)
Mernik.Browser.init()

