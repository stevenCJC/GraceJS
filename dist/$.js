(function(define){

define([], function(){
	

	
	function _selectorAll(selector, what){
		try{
			return what.querySelectorAll(selector);
		} catch(e){
			return [];
		}
	};
var ArrayProto = Array.prototype;

var slice = ArrayProto.slice;


	
	function _shimNodes(nodes,obj){
		if(!nodes)
			return;
		if(nodes.nodeType)
			return obj.elems[obj.length++]=nodes;
		if(nodes.elems){
			obj.elems=nodes.elems;
			obj.length=nodes.length;
		}else if(nodes.length){
			nodes.constructor==Array&&(obj.elems=obj.elems.concat(nodes));
			obj.elems=slice.call(nodes);
			//for(var i=0,len=nodes.length;i<len;i++) obj.elems.push(nodes[i]);
			obj.length=nodes.length;
		}else for(var x in nodes) nodes[x]&&nodes[x].nodeType&&(obj.elems[obj.length++]=nodes[x]);
	}

	
	function _selector(selector, what) {
		selector=selector.trim();
		
		if (selector[0] === "#" && selector.indexOf(".")==-1 && selector.indexOf(" ")===-1 && selector.indexOf(">")===-1){
			if (what == document)
				_shimNodes(what.getElementById(selector.replace("#", "")),this);
			else
				_shimNodes(_selectorAll(selector, what),this);
		} else if (selector[0] === "<" && selector[selector.length - 1] === ">")  //html
		{
			var tmp = document.createElement("div");
			tmp.innerHTML = selector.trim();
			_shimNodes(tmp.childNodes,this);
		} else {
			_shimNodes((_selectorAll(selector, what)),this);
		}
		return this;
	}

	function $(){
		if(arguments.length==1)
			return new Core(arguments[0]);
		else if(arguments.length==2)
			return new Core(arguments[0],arguments[1]);
		else if(arguments.length==3)
			return new Core(arguments[0],arguments[1],arguments[2]);
	}
	$.fn = Core.prototype = {
		constructor: Core,
		selector: _selector,
		oldElement: undefined
	};
	function Core(toSelect, what) {
		this.length = 0;
		this.elems=[];
		if (!toSelect) {
			return this;
		} else if (toSelect instanceof Core && what == undefined) {
			return toSelect;
		} else if ($.isFunction(toSelect)) {
		//////////////
			return $(document).ready(toSelect);
		} else if ($.isArray(toSelect) && toSelect.length != undefined) { //Passing in an array or object
			this.elems=this.elems.concat(toSelect);
			this.length=toSelect.length;
			return this;
		} else if ($.isObject(toSelect) && $.isObject(what)) { //var tmp=$("span");  $("p").find(tmp);
			if (toSelect.length == undefined) {
				if (toSelect.parentNode == what)
					this.elems[this.length++] = toSelect;
			} else {
				for (var i = 0; i < toSelect.length; i++)
					if (toSelect.elems[i].parentNode == what)
						this.elems[this.length++] = toSelect.elems[i];
			}
			return this;
		} else if ($.isObject(toSelect) && what == undefined) { //Single object
			this.elems[this.length++] = toSelect;
			return this;
		} else if (what !== undefined) {
			if (what instanceof Core) {
				return what.find(toSelect);
			}
		
		} else {
			what = document;
		}
		
		return this.selector(toSelect, what);
		
	};




	var each = $.each = function (obj, iterator, context) {
		if (obj == null)
			return;
		if (obj.length === +obj.length) {
			if(context) for (var i = 0, l = obj.length; i < l; i++) {
					if (iterator.call(context, obj[i], i, obj) === false)
						return;
				}
			else for (var i = 0, l = obj.length; i < l; i++) {
					if (iterator(obj[i], i, obj) === false)
						return;
				}
		} else {
			if(context) for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (iterator.call(context, obj[key], key, obj) === false)
						return;
				}
			}
			else  for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (iterator(obj[key], key, obj) === false)
						return;
				}
			}
		}
	};


	// Return the number of elements in an object.
	$.size = function (obj) {
		if (obj == null)
			return 0;
		return (obj.length === +obj.length) ? obj.length : $.keys(obj).length;
	};

	// Return a version of the array that does not contain the specified value(s).
	$.without = function (array) {
		return $.difference(array, slice.call(arguments, 1));
	};

	// Produce a duplicate-free version of the array. If the array has already
	// been sorted, you have the option of using a faster algorithm.
	// Aliased as `unique`.
	$.uniq = $.unique = function (array, isSorted, iterator, context) {
		if ($.isFunction(isSorted)) {
			context = iterator;
			iterator = isSorted;
			isSorted = false;
		}
		var initial = iterator ? $.map(array, iterator, context) : array;
		var results = [];
		var seen = [];
		each(initial, function (value, index) {
			if (isSorted ? (!index || seen[seen.length - 1] !== value) : !$.contains(seen, value)) {
				seen.push(value);
				results.push(array[index]);
			}
		});
		return results;
	};

	// Produce an array that contains the union: each distinct element from all of
	// the passed-in arrays.
	$.union = function () {
		return $.uniq(concat.apply(ArrayProto, arguments));
	};

	// Take the difference between one array and a number of other arrays.
	// Only the elements present in just the first array will remain.
	$.difference = function (array) {
		var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
		return $.filter(array, function (value) {
			return !$.contains(rest, value);
		});
	};


	// Return the results of applying the iterator to each element.
	// Delegates to **ECMAScript 5**'s native `map` if available.
	$.map = function (obj, iterator, context) {
		var results = [];
		if (obj == null)
			return results;
		return obj.map(iterator, context);
	};

	// Return the first value which passes a truth test. Aliased as `detect`.
	$.find = function (obj, iterator, context) {
		var result;
		any(obj, function (value, index, list) {
			if (iterator.call(context, value, index, list)) {
				result = value;
				return true;
			}
		});
		return result;
	};

	// Return all the elements that pass a truth test.
	// Delegates to **ECMAScript 5**'s native `filter` if available.
	// Aliased as `select`.
	$.filter = function (obj, iterator, context) {
		var results = [];
		if (obj == null)
			return results;
		return obj.filter(iterator, context);
	};

	// Determine if at least one element in the object matches a truth test.
	// Delegates to **ECMAScript 5**'s native `some` if available.
	// Aliased as `any`.
	var any = function (obj, iterator, context) {
		iterator || (iterator = $.identity);
		var result = false;
		if (obj == null)
			return result;
		return obj.some(iterator, context);

	};

	// Determine if the array or object contains a given value (using `===`).
	// Aliased as `include`.
	$.contains = function (obj, target) {
		if (obj == null)
			return false;
		return obj.indexOf(target) != -1;
	};

	// Convenience version of a common use case of `map`: fetching a property.
	$.pluck = function (obj, key) {
		return $.map(obj, function (value) {
			return value[key];
		});
	};

	// Convenience version of a common use case of `filter`: selecting only objects
	// containing specific `key:value` pairs.
	$.where = function (obj, attrs, first) {
		if ($.isEmpty(attrs))
			return first ? null : [];
		return _[first ? 'find' : 'filter'](obj, function (value) {
			for (var key in attrs) {
				if (attrs[key] !== value[key])
					return false;
			}
			return true;
		});
	};

	// Convenience version of a common use case of `find`: getting the first object
	// containing specific `key:value` pairs.
	$.findWhere = function (obj, attrs) {
		return $.where(obj, attrs, true);
	};

// Delays a function for the given number of milliseconds, and then calls
	// it with the arguments supplied.
	$.delay = function (func, wait) {
		var args = slice.call(arguments, 2);
		return setTimeout(function () {
			return func(args);
		}, wait);
	};

	// Defers a function, scheduling it to run after the current call stack has
	// cleared.
	$.defer = function (func) {
		return $.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
	};

	// Returns a function, that, when invoked, will only be triggered at most once
	// during a given window of time.
	$.throttle = function (func, wait) {
		var context,
		args,
		timeout,
		result;
		var previous = 0;
		var later = function () {
			previous = new Date;
			timeout = null;
			result = func.apply(context, args);
		};
		return function () {
			var now = new Date;
			var remaining = wait - (now - previous);
			context = this;
			args = arguments;
			if (remaining <= 0) {
				clearTimeout(timeout);
				timeout = null;
				previous = now;
				result = func.apply(context, args);
			} else if (!timeout) {
				timeout = setTimeout(later, remaining);
			}
			return result;
		};
	};

	// Returns a function, that, as long as it continues to be invoked, will not
	// be triggered. The function will be called after it stops being called for
	// N milliseconds. If `immediate` is passed, trigger the function on the
	// leading edge, instead of the trailing.
	$.debounce = function (func, wait, immediate) {
		var timeout,
		result;
		return function () {
			var context = this,
			args = arguments;
			var later = function () {
				timeout = null;
				if (!immediate)
					result = func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow)
				result = func.apply(context, args);
			return result;
		};
	};

	// Returns a function that will be executed at most one time, no matter how
	// often you call it. Useful for lazy initialization.
	$.once = function (func) {
		var ran = false,
		memo;
		return function () {
			if (ran)
				return memo;
			ran = true;
			memo = func.apply(this, arguments);
			func = null;
			return memo;
		};
	};

	// Returns a function that will only be executed after being called N times.
	$.after = function (times, func) {
		if (times <= 0)
			return func();
		return function () {
			if (--times < 1) {
				return func.apply(this, arguments);
			}
		};
	};
	
	$.until=function(handle,callback,timing){
		if(arguments.length==2){
			timing=200;
		}
		var t=setInterval(function(){
			if(handle()){
				callback();
				clearInterval(t);
				t=null;
			}
		},timing);
	}

	// Is a given array, string, or object empty?
	// An "empty" object has no enumerable own-properties.
	$.isEmpty = function (obj) {
		if (obj == null)
			return true;
		if ($.isArray(obj) || $.isString(obj))
			return obj.length === 0;
		for (var key in obj)
			if ($.hasKey(obj, key))
				return false;
		return true;
	};

	// Is a given value a DOM element?
	$.isElement = function (obj) {
		return !!(obj && obj.nodeType === 1);
	};

	// Is a given value an array?
	// Delegates to ECMA5's native Array.isArray
	$.isArray = Array.isArray;

	// Is a given variable an object?
	$.isObject = function (obj) {
		return obj === Object(obj);
	};

	// Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
	each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function (name) {
		$['is' + name] = function (obj) {
			return toString.call(obj) == '[object ' + name + ']';
		};
	});

	// Define a fallback version of the method in browsers (ahem, IE), where
	// there isn't any inspectable "Arguments" type.
	if (!$.isArguments(arguments)) {
		$.isArguments = function (obj) {
			return !!(obj && $.hasKey(obj, 'callee'));
		};
	}

	// Optimize `isFunction` if appropriate.
	if (typeof(/./) !== 'function') {
		$.isFunction = function (obj) {
			return typeof obj === 'function';
		};
	}

	// Is a given object a finite number?
	$.isFinite = function (obj) {
		return isFinite(obj) && !isNaN(parseFloat(obj));
	};

	// Is the given value `NaN`? (NaN is the only number which does not equal itself).
	$.isNaN = function (obj) {
		return $.isNumber(obj) && obj != +obj;
	};

	// Is a given value a boolean?
	$.isBoolean = function (obj) {
		return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
	};

	// Is a given value equal to null?
	$.isNull = function (obj) {
		return obj === null;
	};

	// Is a given variable undefined?
	$.isUndefined = function (obj) {
		return obj === void 0;
	};
var ObjProto = Object.prototype;

var hasOwnProperty = ObjProto.hasOwnProperty;



	// Retrieve the names of an object's properties.
	// Delegates to **ECMAScript 5**'s native `Object.keys`
	$.keys = Object.keys;

	// Retrieve the values of an object's properties.
	$.values = function (obj) {
		var values = [];
		for (var key in obj)
			if ($.hasKey(obj, key))
				values.push(obj[key]);
		return values;
	};

	// Extend a given object with all the properties in passed-in object(s).
	$.extend = function (obj) {
		each(slice.call(arguments, 1), function (source) {
			if (source) {
				for (var prop in source) {
					obj[prop] = source[prop];
				}
			}
		});
		return obj;
	};

	// Return a copy of the object only containing the whitelisted properties.
	$.pick = function (obj) {
		var copy = {};
		var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
		each(keys, function (key) {
			if (key in obj)
				copy[key] = obj[key];
		});
		return copy;
	};

	// Return a copy of the object without the blacklisted properties.
	$.omit = function (obj) {
		var copy = {};
		var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
		for (var key in obj) {
			if (!$.contains(keys, key))
				copy[key] = obj[key];
		}
		return copy;
	};

	// Create a (shallow-cloned) duplicate of an object.
	$.clone = function (obj) {
		if (!$.isObject(obj))
			return obj;
		return $.isArray(obj) ? obj.slice() : $.extend({}, obj);
	};

	// Invokes interceptor with the obj, and then returns obj.
	// The primary purpose of this method is to "tap into" a method chain, in
	// order to perform operations on intermediate results within the chain.
	$.tap = function (obj, interceptor) {
		interceptor(obj);
		return obj;
	};
	// Shortcut function for checking if an object has a given property directly
	// on itself (in other words, not on a prototype).
	$.hasKey = function (obj, key) {
		return hasOwnProperty.call(obj, key);
	};

	// Return a random integer between min and max (inclusive).
	$.random = function (min, max) {
		if (max == null) {
			max = min;
			min = 0;
		}
		return min + Math.floor(Math.random() * (max - min + 1));
	};



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



	function cleanUpNode(node, kill){
		//kill it before it lays eggs!
		if(kill && node.dispatchEvent){
			var e = $.Event('destroy', {bubbles:false});
			node.dispatchEvent(e);
		}
		var id = _id(node);
		if(id && handlers[id]){
			for(var key in handlers[id])
				node.removeEventListener(handlers[id][key].e, handlers[id][key].proxy, false);
			delete handlers[id];
		}
	}
	
	$.cleanUpContent = function(node, itself, kill){
		if(!node) return;
		//cleanup children
		var elems = $('[_id]',node).elems;
		if(elems.length > 0) 
			for(var i=0,len=elems.length;i<len;i++){
				cleanUpNode(elems[i], kill);
			}
		//cleanUp this node
		if(itself) cleanUpNode(node, kill);
	}
var fragementRE = /^\s*<(\w+)[^>]*>/



	$.extend($.fn , {

		
		html: function(html,cleanup) {
			if (this.length === 0)
				return this;
			if (html === undefined)
				return this.elems[0].innerHTML;

			for (var i = 0,len=this.length; i <len ; i++) {
				if(cleanup!==false)
					$.cleanUpContent(this.elems[i], false, true);
				this.elems[i].innerHTML = html;
			}
			return this;
		},

		text: function(text) {
			if (this.length === 0)
				return this;
			if (text === undefined)
				return this.elems[0].textContent;
			for (var i = 0,len=this.length; i <len ; i++) {
				this.elems[i].textContent = text;
			}
			return this;
		},
		

		
		remove: function(selector) {
			var elems = $(this).filter(selector).elems;
			if (elems == undefined)
				return this;
			for (var i = 0,len=elems.length; i <len ; i++) {
				$.cleanUpContent(elems[i], true, true);
				elems[i].parentNode.removeChild(elems[i]);
			}
			return this;
		},
		


		
		append: function(element, insert) {
			if (element && element.length != undefined && element.length === 0)
				return this;
			if ($.isArray(element) || $.isObject(element))
				element = $(element);
			var i;
			
			
			for (i = 0; i < this.length; i++) {
				if (element.length && typeof element != "string") {
					element = $(element);
					_insertFragments(element,this.elems[i],insert);
				} else {
					var obj =fragementRE.test(element)?$(element):undefined;
					if (obj == undefined || obj.length == 0) {
						obj = document.createTextNode(element);
					}
					if (obj.nodeName != undefined && obj.nodeName.toLowerCase() == "script" && (!obj.type || obj.type.toLowerCase() === 'text/javascript')) {
						window.eval(obj.innerHTML);
					} else if(obj instanceof $.fn.constructor) {
						_insertFragments(obj,this.elems[i],insert);
					}
					else {
						insert != undefined ? this.elems[i].insertBefore(obj, this.elems[i].firstChild) : this.elems[i].appendChild(obj);
					}
				}
			}
			return this;
		},
		
		appendTo:function(selector,insert){
			var tmp=$(selector);
			tmp.append(this);
			return this;
		},
		
		prependTo:function(selector){
			var tmp=$(selector);
			tmp.append(this,true);
			return this;
		},
		
		prepend: function(element) {
			return this.append(element, 1);
		},
		
		before: function(target, after) {
			if (this.length == 0)
				return this;
			target = $(target).eq(0);
			if (!target)
				return this;
			for (var i = 0; i < this.length; i++)
			{
				after ? target.parentNode.insertBefore(this.elems[i], target.nextSibling) : target.parentNode.insertBefore(this.elems[i], target);
			}
			return this;
		},
		
	   after: function(target) {
			this.insertBefore(target, true);
		},
		

		
		clone: function(deep) {
			deep = deep === false ? false : true;
			if (this.length == 0)
				return this;
			var elems = [];
			for (var i = 0,len=this.length; i < len; i++) {
				elems.push(this.elems[i].cloneNode(deep));
			}
			
			return $(elems);
		},

	});


	$.extend($.fn , {
		attr: function(attr, value) {
			var id,el;
			if (this.length === 0)
				return (value === undefined) ? undefined : this;            
			if (value === undefined && !$.isObject(attr)) {
				id=has_id(this.elems[0]);
				return (id&&_attrCache[id][attr])?_attrCache[id][attr]:this.elems[0].getAttribute(attr);
			}
			for (var i = 0,len=this.length; i <len ; i++) {
				id=has_id(this.elems[i]);
				el=this.elems[i];
				if ($.isObject(attr)) {
					for (var key in attr) {
						$(el).attr(key,attr[key]);
					}
				}
				else if($.isArray(value)||$.isObject(value)||$.isFunction(value))
				{
					
					if(!id)
						id=_id(el);
					
					if(!_attrCache[id])
						_attrCache[id]={}
					_attrCache[id][attr]=value;
				}
				else if (value == null && value !== undefined)
				{
					el.removeAttribute(attr);
					if(id) _attrCache[id][attr];
						delete _attrCache[id][attr];
				}
				else{
					el.setAttribute(attr, value);
				}
			}
			return this;
		},
		
		removeAttr: function(attr) {
			var attrs=attr.split(/\s+|\,/g),el,at,id;
			for (var i = 0,len=this.length; i <len ; i++) {
				el=this.elems[i];
				id=has_id(el);
				for(var j=0,lem=attrs.length;j<lem;j++){
					at=attrs[j];
					el.removeAttribute(at);
					if(id&&_attrCache[id][at])
						delete _attrCache[id][at];
				}
			}
			return this;
		},

		
		prop: function(prop, value) {
			var id,el;
			if (this.length === 0)
				return (value === undefined) ? undefined : this;          
			if (value === undefined && !$.isObject(prop)) {
				
				var res;id=has_id(this.elems[0]);
				var val = (id&&_propCache[id][prop])?(id&&_propCache[id][prop]):!(res=this.elems[0][prop])&&prop in this.elems[0]?this.elems[0][prop]:res;
				return val;
			}
			for (var i = 0,len=this.length; i <len ; i++) {
				
				el=this.elems[i];
				id=has_id(el);
				
				if ($.isObject(prop)) {
					for (var key in prop) {
						$(el).prop(key,prop[key]);
					}
				}
				else if($.isArray(value)||$.isObject(value)||$.isFunction(value))
				{
					
					if(!id)
						id=_id(el);
					
					if(!_propCache[id])
						_propCache[id]={}
					_propCache[id][prop]=value;
				}
				else if (value == null && value !== undefined)
				{
					$(el).removeProp(prop);
					if(id) _propCache[id][prop];
						delete _propCache[id][prop];
				}
				else{
					el[prop]= value;
				}
			}
			return this;
		},
		
		removeProp: function(prop) {
			var p=prop.split(/\s+|\,/g),el,pr;
			for (var i = 0,len=this.length; i <len ; i++) {
				el=this.elems[i];
				for (var j = 0,lem=p.length; j <lem ; j++) {
					pr=p[j];
					if(el[pr])
						delete el[pr];
					if(el.jqmCacheId&&_propCache[el.jqmCacheId][pr]){
							delete _propCache[el.jqmCacheId][pr];
					}
				}
			}
			return this;
		},


	
		
		parseForm: function() {
			if (this.length == 0)
				return "";
			var params = {},elems,elem,type,tmp;
			for (var i = 0,len=this.length; i <len ; i++) {
				if(elems= this.elems[i].elements){
					for(var j=0,lem=elems.length;j<lem;j++){
						elem=elems[j];
						type = elem.getAttribute("type");
						if (elem.nodeName.toLowerCase() != "fieldset" && !elem.disabled && type != "submit" 
						&& type != "reset" && type != "button" && ((type != "radio" && type != "checkbox") || elem.checked))
						{

							if(elem.getAttribute("name")){
								if(elem.type=="select-multiple"){
									tmp=params[elem.getAttribute("name")]=[];
									for(var j=0;j<elem.options.length;j++){
										if(elem.options[j].selected)
											tmp.push(elem.options[j].value);
									}
								}
								else
									params[elem.getAttribute("name")]=elem.value;
							}
						}
					}
				}
			}
			return params;
		},

		val: function(value) {
			if (this.length === 0)
				return (value === undefined) ? undefined : this;
			if (value == undefined)
				return this.elems[0].value;
			for (var i = 0,len=this.length; i <len ; i++) {
				this.elems[i].value = value;
			}
			return this;
		},
		
		
		data: function(key, value) {
			return this.attr('data-' + key, value);
		},


		_id:function(make){
			if(make)return _id(this.elems[0]);
			return has_id(this.elems[0]);
		},
		


	});


	$.extend($.fn , {

		ready: function(callback) {
			if (document.readyState === "complete" || document.readyState === "loaded"||document.readyState==="interactive") 
				callback();
			else
				document.addEventListener("DOMContentLoaded", callback, false);
			return this;
		},
		
		is:function(selector){
			return !!selector&&this.filter(selector).length>0;
		}

	});


	$.extend($.fn , {

		setupOld: function(params) {
			if (params == undefined)
				return $();
			params.oldElement = this;
			return params;
		},
		
		//如果callback返回数据，则返回[数据]，否则默认返回this
		each: function(callback) {
			var el=this.elems,tmp,returns=[];
			for(var i=0,len=el.length;i<len;i++){
				tmp=callback.call(el[i], i, el);
				if(tmp)returns.push(tmp);
			}
			if(returns.length)return returns;
			return this;
		},
		
		
		
		find: function(sel) {
			if (this.length === 0)
				return this;
			var elems = [];
			var tmpElems;
			for (var i = 0,len=this.length; i <len ; i++) {
				tmpElems = $(sel, this.elems[i]).elems;
				for (var j = 0; j < tmpElems.length; j++) {
					elems.push(tmpElems[j]);
				}
			}
			return $(unique(elems));
		},
		
		
		parent: function(selector,recursive) {
			if (this.length == 0)
				return this;
			var elems = [];
			for (var i = 0,len=this.length; i <len ; i++) {
				var tmp=this.elems[i];
				while(tmp.parentNode&&tmp.parentNode!=document){
					elems.push(tmp.parentNode);
					if(tmp.parentNode)
						tmp=tmp.parentNode;
					if(!recursive)
						break;
				}
			}
			return this.setupOld($(unique(elems)).filter(selector));
		},
		
		parents: function(selector) {
			return this.parent(selector,true);
		},
		
		children: function(selector) {
			
			if (this.length == 0)
				return this;
			var elems = [];
			for (var i = 0,len=this.length; i <len ; i++) {
				elems = elems.concat(siblings(this.elems[i].firstChild));
			}
			return this.setupOld($((elems)).filter(selector));
		
		},
		
		siblings: function(selector) {
			if (this.length == 0)
				return this;
			var elems = [];
			for (var i = 0,len=this.length; i <len ; i++) {
				if (this.elems[i].parentNode)
					elems = elems.concat(siblings(this.elems[i].parentNode.firstChild, this.elems[i]));
			}
			return this.setupOld($(elems).filter(selector));
		},
		
		closest: function(selector, context) {
			if (this.length == 0)
				return this;
			var elems = [], 
			cur = this.elems[0];
			
			var start = $(selector, context);
			if (start.length == 0)
				return $();
			while (cur && start.elems.indexOf(cur) == -1) {
				cur = cur !== context && cur !== document && cur.parentNode;
			}
			return $(cur);
		
		},
	   
		filter: function(selector) {
			if (this.length == 0)
				return this;
			
			if (selector == undefined)
				return this;
			var elems = [];
			for (var i = 0,len=this.length; i <len ; i++) {
				var val = this.elems[i];
				if (val.parentNode && $(selector, val.parentNode).elems.indexOf(val) >= 0)
					elems.push(val);
			}
			return this.setupOld($(unique(elems)));
		},
		
		not: function(selector) {
			if (this.length == 0)
				return this;
			var elems = [];
			for (var i = 0,len=this.length; i <len ; i++) {
				var val = this.elems[i];
				if (val.parentNode && $(selector, val.parentNode).elems.indexOf(val) == -1)
					elems.push(val);
			}
			return this.setupOld($(unique(elems)));
		},
		
		end: function() {
			return this.oldElement != undefined ? this.oldElement : $();
		},
		
		
	   
		eq:function(ind){
			var index;
			index = index == undefined ? 0 : ind;
			if (index < 0)
				index += this.length;
			return $((this.elems[index]) ? this.elems[index] : undefined);
		},
		
		index:function(elem){
			return elem?this.elems.indexOf($(elem)[0]):this.parent().children().elems.indexOf(this.elems[0]);
		},
		

	});


	$.extend($.fn , {

		
		css: function(attribute, value, obj) {
			var toAct = obj != undefined ? obj : this.elems[0];
			if (this.length === 0)
				return this;
			if (value == undefined && typeof (attribute) === "string") {
				var styles = window.getComputedStyle(toAct);
				return  toAct.style[attribute] ? toAct.style[attribute]: window.getComputedStyle(toAct)[attribute] ;
			}
			for (var i = 0,len=this.length; i <len ; i++) {
				if ($.isObject(attribute)) {
					for (var j in attribute) {
						this.elems[i].style[j] = attribute[j];
					}
				} else {
					this.elems[i].style[attribute] = value;
				}
			}
			return this;
		},
		
		hide: function() {
			if (this.length === 0)
				return this;
			for (var i = 0,len=this.length; i <len ; i++) {
				if (this.css("display", null, this.elems[i]) != "none") {
					this.elems[i].setAttribute("jqmOld_display", this.css("display", null, this.elems[i]));
					this.elems[i].style.display = "none";
				}
			}
			return this;
		},
		
		show: function() {
			if (this.length === 0)
				return this;
			for (var i = 0,len=this.length; i <len ; i++) {
				if (this.css("display", null, this.elems[i]) == "none") {
					this.elems[i].style.display = this.elems[i].getAttribute("jqmOld_display") ? this.elems[i].getAttribute("jqmOld_display") : 'block';
					this.elems[i].removeAttribute("jqmOld_display");
				}
			}
			return this;
		},
		
		toggle: function(show) {
			var show2 = show === true ? true : false;
			for (var i = 0,len=this.length; i <len ; i++) {
				if (window.getComputedStyle(this.elems[i])['display'] !== "none" || (show !== undefined && show2 === false)) {
					this.elems[i].setAttribute("jqmOld_display", this.elems[i].style.display)
					this.elems[i].style.display = "none";
				} else {
					this.elems[i].style.display = this.elems[i].getAttribute("jqmOld_display") != undefined ? this.elems[i].getAttribute("jqmOld_display") : 'block';
					this.elems[i].removeAttribute("jqmOld_display");
				}
			}
			return this;
		},
		
		
		addClass: function(name) {
			var el;
			for (var i = 0,len=this.length; i <len ; i++) {
				el = this.elems[i];
				el.classList.add(name);
			}
			return this;
		},
		
		removeClass: function(name) {
			var el;
			for (var i = 0,len=this.length; i <len ; i++) {
				el = this.elems[i];
				if (name == undefined) {
					el.className = '';
					continue;
				}
				
				el.classList.remove(name);
			}
			return this;
		},
		
		replaceClass: function(name, newName) {
			var el;
			for (var i = 0,len=this.length; i <len ; i++) {
				el = this.elems[i];
				if (!newName) {
					el.className = name;
					continue;
				}
					el.classList.add(newName);
					el.classList.remove(name);
			}
			return this;
		},
		
		toggleClass: function(name) {
			var el;
			for (var i = 0,len=this.length; i <len ; i++) {
				if (name == undefined) {
					return this;
				}
				el = this.elems[i];
				el.classList.toggle(name);
			}
			return this;
		},
		
		hasClass: function(name, element) {
			if (this.length === 0)
				return false;
			if (!element)
				element = this.elems[0];
			return element.classList.contains(name);
		},

		
		offset: function() {
			if (this.length === 0)
				return this;
			if(this.elems[0]==window)
				return {
					left:0,
					top:0,
					right:0,
					bottom:0,
					width:window.innerWidth,
					height:window.innerHeight
				}
			else
				var obj = this.elems[0].getBoundingClientRect();
			return {
				left: obj.left + window.pageXOffset,
				top: obj.top + window.pageYOffset,
				right: obj.right + window.pageXOffset,
				bottom: obj.bottom + window.pageYOffset,
				width: obj.right-obj.left,
				height: obj.bottom-obj.top
			};
		},
		
		height:function(val){
			if (this.length === 0)
				return this;
			if(val!=undefined)
				return this.css("height",val);
			if(this.elems[0]==this.elems[0].window)
				return window.innerHeight;
			if(this.elems[0].nodeType==this.elems[0].DOCUMENT_NODE)
				return this.elems[0].documentElement['offsetheight'];
			else{
				var tmpVal=this.css("height").replace("px","");
				if(tmpVal)
					return tmpVal
				else
					return this.offset().height;
			}
		},
		
		width:function(val){
			if (this.length === 0)
				return this;
			 if(val!=undefined)
				return this.css("width",val);
			if(this.elems[0]==this.elems[0].window)
				return window.innerWidth;
			if(this.elems[0].nodeType==this.elems[0].DOCUMENT_NODE)
				return this.elems[0].documentElement['offsetwidth'];
			else{
				var tmpVal=this.css("width").replace("px","");
				if(tmpVal)
					return tmpVal
				else
				   return this.offset().width;
			}
		},
	});


	
	$.fn.on = function(event, selector, callback) {
		return selector === undefined || $.isFunction(selector) ? _bind(this.elems,event, selector) : _delegate(this.elems,selector, event, callback);
	};
   
	$.fn.off = function(event, selector, callback) {
		return selector === undefined || $.isFunction(selector) ? _unbind(this.elems,event, selector) : _undelegate(this.elems,selector, event, callback);
	};

	$.fn.one = function(event, callback) {
		return this.each(function(i, element) {
			add(this, event, callback, null, function(fn, type) {
				return function() {
					var result = fn.apply(element, arguments);
					remove(element, type, fn);
					return result;
				}
			});
		});
	};
	
	$.fn.trigger = function(event, data, props) {
		if (typeof event == 'string')
			event = makeEvent(event, props);
		event.data = data;
		for (var i = 0,len=this.length; i <len ; i++) {
			this.elems[i].dispatchEvent(event)
		}
		return this;
	};
	
	var eventtrigger=["click","keydown","keyup","keypress","submit","load","resize","change","select","error"];
	for(var i=0,len=eventtrigger.length;i<len;i++)
		(function(i){
			$.fn[eventtrigger[i]]=function(cb){
				return cb?_bind(this.elems,eventtrigger[i],cb):this.trigger(eventtrigger[i]);
			}
		})(i);



	return $;
});
})(typeof define != "undefined" ?
	define: // AMD/RequireJS format if available
	function(deps, factory){
		if(typeof module !="undefined"){
			module.exports = factory(); // CommonJS environment, like NodeJS
		//	require("./configure");
		}else{
			window.G = factory(); // raw script, assign to Compose global
		}
	});