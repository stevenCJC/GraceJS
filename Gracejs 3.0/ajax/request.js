define(['g','_/object','_/is'], function (g) {
	
	
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
	 * Converts an object into a key/value par with an optional prefix.  Used for converting objects to a query string
	```
	var obj={
	foo:'foo',
	bar:'bar'
	}
	var kvp=queryString(obj,'data');
	```

	 * @param {Object} object
	 * @param {String} [prefix]前缀
	 * @return {String} Key/value pair representation
	 * @title queryString(object,[prefix];
	 */

	function queryString(obj, prefix) {
		var str = [];
		for (var p in obj) {
			var k = prefix ? prefix + "[" + p + "]" : p,
			v = obj[p];
			str.push(g.is.object(v) ? queryString(v, k) : (k) + "=" + encodeURIComponent(v));
		}
		return str.join("&");
	};


	
	function request(opts) {
		var xhr;
		
		opts.error=errCallback(opts);
		
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
				
				}
			}
			if (typeof settings.data == 'object')
				settings.data = queryString(settings.data);
			if (settings.type.toLowerCase() === "get" && settings.data) {
				if (settings.url.indexOf("?") === -1)
					settings.url += "?" + settings.data;
				else
					settings.url += "&" + settings.data;
			}

			if (settings.crossDomain === null)
				settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
					RegExp.$2 != window.location.host;

			if (!settings.crossDomain)
				settings.headers = g.o.extend({
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
	
	function errCallback(opts){
		if(g.DEBUG.open){
			if(!opts.orgError) opts.orgError=opts.error;
			else return opts.error;
			return function(e){
				var url=g.DEBUG.ajaxRedirect(opts.url,opts.data,opts.method);
				if(url)
					ajax({
						url:url,
						dataType : 'html',
						success :function(data){
							try{
								if(datatype=='json') {
									var d="var json="+data;
									eval(d);
								}
							}catch(e){
								opts.orgError(e);
							}
							opts.success(json||data);
						},
						error :opts.orgError,
						orgError:1,//避免死循环
					});
			}
		}else return opts.error;
	}
	
	return request;
});
