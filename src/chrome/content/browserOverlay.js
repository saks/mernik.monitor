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


const NOTIFY_STATE_DOCUMENT = Components.interfaces.nsIWebProgress.NOTIFY_STATE_DOCUMENT;
const STATE_IS_DOCUMENT     = Components.interfaces.nsIWebProgressListener.STATE_IS_DOCUMENT;
const STATE_START           = Components.interfaces.nsIWebProgressListener.STATE_START;

function registerMyListener() {
	window.getBrowser().addProgressListener(myListener , NOTIFY_STATE_DOCUMENT);
}

function unregisterMyListener() {
	window.getBrowser().removeProgressListener(myListener);
}

window.addEventListener("load",  registerMyListener,  false);
window.addEventListener("unload",unregisterMyListener,false);

var myListener = {
	onStateChange:function(aProgress,aRequest,aFlag,aStatus) {
		if(aFlag & (STATE_IS_DOCUMENT|STATE_START)) {
			aRequest.QueryInterface(Components.interfaces.nsIChannel);
			dump("Wait a moment!\n"+aRequest.URI.spec);
		}
	},
	onLocationChange:function(a,b,c) {
//		dump("onLocationChange called\n");
	},
	onProgressChange:function(a,b,c,d,e,f) {
//		dump("onProgressChange called\n");
	},
	onStatusChange:function(a,b,c,d) {
//		dump("onStatusChange called\n");
	},
	onSecurityChange:function(a,b,c) {
//		dump("onSecurityChange called\n");
	},

//XXX
//This is not nsIWebProgressListenr method,
//just killing a error in tabbrowser.xml
//Maybe a bug.
	onLinkIconAvailable:function(a) {
//		dump("onLinkIconAvailable called\n")
	}
}

