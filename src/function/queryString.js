	/**
	 * Converts an object into a key/value par with an optional prefix.  Used for converting objects to a query string
	```
	var obj={
	foo:'foo',
	bar:'bar'
	}
	var kvp=$.param(obj,'data');
	```

	 * @param {Object} object
	 * @param {String} [prefix]前缀
	 * @return {String} Key/value pair representation
	 * @title $.queryString(object,[prefix];
	 */

	$.queryString = function (obj, prefix) {
		var str = [];
		if (obj instanceof $jqm) {
			for (var i = 0, len = obj.length; i < len; i++) {
				var k = prefix ? prefix + "[]" : obj.elems[i].name,
				v = obj.elems[i].value;
				str.push((k) + "=" + encodeURIComponent(v));
			};
		} else {
			for (var p in obj) {
				var k = prefix ? prefix + "[" + p + "]" : p,
				v = obj[p];
				str.push($.isObject(v) ? $.queryString(v, k) : (k) + "=" + encodeURIComponent(v));
			}
		}
		return str.join("&");
	};