define(["./core"], function (G) {

	/* AJAX functions */

	function empty() {}
	var ajaxSettings = {
		type : 'GET',
		beforeSend : empty,
		success : empty,
		error : empty,
		complete : empty,
		context : undefined,
		timeout : 0,
		crossDomain : null
	};
	/**
	 * Execute a jsonP call, allowing cross domain scripting
	 * options.url - URL to call
	 * options.success - Success function to call
	 * options.error - Error function to call
	```
	$.jsonP({url:'mysite.php?callback=?&foo=bar',success:function(){},error:function(){}});
	```

	 * @param {Object} options
	 * @title $.jsonP(options)
	 */
	$.jsonP = function (options) {
		var callbackName = 'jsonp_callback' + (++_jsonPID);
		var abortTimeout = "",
		context;
		var script = document.createElement("script");
		var abort = function () {
			$(script).remove();
			if (window[callbackName])
				window[callbackName] = empty;
		};
		window[callbackName] = function (data) {
			clearTimeout(abortTimeout);
			$(script).remove();
			delete window[callbackName];
			options.success.call(context, data);
		};
		script.src = options.url.replace(/=\?/, '=' + callbackName);
		if (options.error) {
			script.onerror = function () {
				clearTimeout(abortTimeout);
				options.error.call(context, "", 'error');
			}
		}
		$('head').append(script);
		if (options.timeout > 0)
			abortTimeout = setTimeout(function () {
					options.error.call(context, "", 'timeout');
				}, options.timeout);
		return {};
	};

	/**
	 * Execute an Ajax call with the given options
	 * options.type - Type of request
	 * options.beforeSend - function to execute before sending the request
	 * options.success - success callback
	 * options.error - error callback
	 * options.complete - complete callback - callled with a success or error
	 * options.timeout - timeout to wait for the request
	 * options.url - URL to make request against
	 * options.contentType - HTTP Request Content Type
	 * options.headers - Object of headers to set
	 * options.dataType - Data type of request
	 * options.data - data to pass into request.  $.param is called on objects
	```
	var opts={
	type:"GET",
	success:function(data){},
	url:"mypage.php",
	data:{bar:'bar'},
	}
	$.ajax(opts);
	```

	 * @param {Object} options
	 * @title $.ajax(options)
	 */
	$.ajax = function (opts) {
		var xhr;
		try {

			var settings = opts || {};
			for (var key in ajaxSettings) {
				if (typeof(settings[key]) == 'undefined')
					settings[key] = ajaxSettings[key];
			}

			if (!settings.url)
				settings.url = window.location;
			if (!settings.contentType)
				settings.contentType = "application/x-www-form-urlencoded";
			if (!settings.headers)
				settings.headers = {};

			if (!('async' in settings) || settings.async !== false)
				settings.async = true;

			if (!settings.dataType)
				settings.dataType = "text/html";
			else {
				switch (settings.dataType) {
				case "script":
					settings.dataType = 'text/javascript, application/javascript';
					break;
				case "json":
					settings.dataType = 'application/json';
					break;
				case "xml":
					settings.dataType = 'application/xml, text/xml';
					break;
				case "html":
					settings.dataType = 'text/html';
					break;
				case "text":
					settings.dataType = 'text/plain';
					break;
				default:
					settings.dataType = "text/html";
					break;
				case "jsonp":
					return $.jsonP(opts);
					break;
				}
			}
			if ($.isObject(settings.data))
				settings.data = $.param(settings.data);
			if (settings.type.toLowerCase() === "get" && settings.data) {
				if (settings.url.indexOf("?") === -1)
					settings.url += "?" + settings.data;
				else
					settings.url += "&" + settings.data;
			}

			if (/=\?/.test(settings.url)) {
				return $.jsonP(settings);
			}
			if (settings.crossDomain === null)
				settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
					RegExp.$2 != window.location.host;

			if (!settings.crossDomain)
				settings.headers = $.extend({
						'X-Requested-With' : 'XMLHttpRequest'
					}, settings.headers);
			var abortTimeout;
			var context = settings.context;
			var protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;

			//ok, we are really using xhr
			xhr = new window.XMLHttpRequest();

			xhr.onreadystatechange = function () {
				var mime = settings.dataType;
				if (xhr.readyState === 4) {
					clearTimeout(abortTimeout);
					var result,
					error = false;
					if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0 && protocol == 'file:') {
						if (mime === 'application/json' && !(/^\s*$/.test(xhr.responseText))) {
							try {
								result = JSON.parse(xhr.responseText);
							} catch (e) {
								error = e;
							}
						} else if (mime === 'application/xml, text/xml') {
							result = xhr.responseXML;
						} else if (mime == "text/html") {
							result = xhr.responseText;
							$.parseJS(result);
						} else
							result = xhr.responseText;
						//If we're looking at a local file, we assume that no response sent back means there was an error
						if (xhr.status === 0 && result.length === 0)
							error = true;
						if (error)
							settings.error.call(context, xhr, 'parsererror', error);
						else {
							settings.success.call(context, result, 'success', xhr);
						}
					} else {
						error = true;
						settings.error.call(context, xhr, 'error');
					}
					settings.complete.call(context, xhr, error ? 'error' : 'success');
				}
			};
			xhr.open(settings.type, settings.url, settings.async);
			if (settings.withCredentials)
				xhr.withCredentials = true;
				

			if (settings.contentType)
				settings.headers['Content-Type'] = settings.contentType;
			for (var name in settings.headers)
				xhr.setRequestHeader(name, settings.headers[name]);
			if (settings.beforeSend.call(context, xhr, settings) === false) {
				xhr.abort();
				return false;
			}

			if (settings.timeout > 0)
				abortTimeout = setTimeout(function () {
						xhr.onreadystatechange = empty;
						xhr.abort();
						settings.error.call(context, xhr, 'timeout');
					}, settings.timeout);
			xhr.send(settings.data);
		} catch (e) {
			// General errors (e.g. access denied) should also be sent to the error callback
			console.log(e);
			settings.error.call(context, xhr, 'error', e);
		}
		return xhr;
	};

	/**
	 * Shorthand call to an Ajax GET request
	```
	$.get("mypage.php?foo=bar",function(data){});
	```

	 * @param {String} url to hit
	 * @param {Function} success
	 * @title $.get(url,success)
	 */
	$.get = function (url, success) {
		return this.ajax({
			url : url,
			success : success
		});
	};
	/**
	 * Shorthand call to an Ajax POST request
	```
	$.post("mypage.php",{bar:'bar'},function(data){});
	```

	 * @param {String} url to hit
	 * @param {Object} [data] to pass in
	 * @param {Function} success
	 * @param {String} [dataType]
	 * @title $.post(url,[data],success,[dataType])
	 */
	$.post = function (url, data, success, dataType) {
		if (typeof(data) === "function") {
			success = data;
			data = {};
		}
		if (dataType === undefined)
			dataType = "html";
		return this.ajax({
			url : url,
			type : "POST",
			data : data,
			dataType : dataType,
			success : success
		});
	};
	/**
	 * Shorthand call to an Ajax request that expects a JSON response
	```
	$.getJSON("mypage.php",{bar:'bar'},function(data){});
	```

	 * @param {String} url to hit
	 * @param {Object} [data]
	 * @param {Function} [success]
	 * @title $.getJSON(url,data,success)
	 */
	$.getJSON = function (url, data, success) {
		if (typeof(data) === "function") {
			success = data;
			data = {};
		}
		return this.ajax({
			url : url,
			data : data,
			success : success,
			dataType : "json"
		});
	};

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
	 * @param {String} [prefix]
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
	/**
	 * Used for backwards compatibility.  Uses native JSON.parse function
	```
	var obj=$.parseJSON("{\"bar\":\"bar\"}");
	```

	 * @params {String} string
	 * @return {Object}
	 * @title $.parseJSON(string)
	 */
	$.parseJSON = function (string) {
		return JSON.parse(string);
	};
	/**
	 * Helper function to convert XML into  the DOM node representation
	```
	var xmlDoc=$.parseXML("<xml><foo>bar</foo></xml>");
	```

	 * @param {String} string
	 * @return {Object} DOM nodes
	 * @title $.parseXML(string)
	 */
	$.parseXML = function (string) {
		return (new DOMParser).parseFromString(string, "text/xml");
	};
});
