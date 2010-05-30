/* initialize Mernik namespace if it was not initialized */
if ('undefined' == typeof(Mernik)) var Mernik = {};
Mernik.DEBUG = true;

function log(text) {
	if (!Mernik.DEBUG) return;

	var result = "";

	if ('string' == typeof(text)) {
		result += text
	} else if ('object' == typeof(text)) {
		var pairs = [];
		for (k in text) {
			pairs.push("" + k + ": " + text[k])
		}
		result += ("<" + text.constructor + "> [" + pairs.join(', ') + "]")
	} else if ('undefined' == typeof(text)){
		result += "undefined";
	} else {
		result += "unknown type: " + typeof(text)
	};

	dump(result); dump("\n")

}

