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


	function unique(arr) {
		for (var i = 0,len=arr.length; i < len; i++) {
			if (arr.indexOf(arr[i]) != i) {
				arr.splice(i, 1);
				i--;
			}
		}
		return arr;
	}

	
	function _shimNodes(nodes,obj){
		if(!nodes)
			return;
		var i=0;
		if(nodes.nodeType)
			return obj[obj.length++]=nodes;
		for(var i=0,len=nodes.length;i<len;i++) {
			obj[obj.length++]=nodes[i];
		}
	}

	
	function _selector(selector, what) {
		selector=selector.trim();
		if (selector[0] === "#" && selector.indexOf(",")==-1 && selector.indexOf(".")==-1 && selector.indexOf(" ")===-1 && selector.indexOf(">")===-1){
			if (what == document)
				_shimNodes(what.getElementById(selector.replace("#", "")),this);
			else
				_shimNodes(_selectorAll(selector, what),this);
		}  else if (selector[0] === "<" && selector[selector.length - 1] === ">"){
			var tmp = document.createElement("div");
			tmp.innerHTML = selector.trim();
			_shimNodes(tmp.childNodes,this);
		} else {
			_shimNodes((_selectorAll(selector, what)),this);
		}
		return this;
	}

	function $(s,w){
		return new Core(s,w);
	}
	$.fn = Core.prototype = {
		constructor: Core,
		selector: _selector,
		oldElement: undefined,
		forEach: [].forEach,
		reduce: [].reduce,
		push: [].push,
		indexOf: [].indexOf,
		concat: [].concat,
		slice: [].slice,
	};
	$.DEBUG={
		open:false,
		ajaxRedirect:function(url,data,method){},
	};
	
	function Core(toSelect, what) {
		this.length = 0;
		if (!toSelect) {
			return this;
		} else if (toSelect instanceof Core && what == undefined) {
			return toSelect;
		} else if ($.isFunction(toSelect)) {
		//////////////
			return $(document).ready(toSelect);
		} else if ($.isArray(toSelect) || toSelect.length != undefined&&!$.isString(toSelect)) { //Passing in an array or object
			for (var i = 0; i < toSelect.length; i++)
                    this[this.length++] = toSelect[i];
            return this;
		} else if ($.isObject(toSelect) && $.isObject(what)) { //var tmp=$("span");  $("p").find(tmp);
			if (toSelect.length == undefined) {
				if (toSelect.parentNode == what)
					this[this.length++] = toSelect;
			} else {
				for (var i = 0; i < toSelect.length; i++)
					if (toSelect[i].parentNode == what)
						this[this.length++] = toSelect[i];
			}
			return this;
		} else if ($.isObject(toSelect) && what == undefined) { //Single object
			if (toSelect.nodeType)
				this[this.length++] = toSelect;
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
					if (iterator.call(obj[i], obj[i], i, obj) === false)
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
					if (iterator.call(obj[key], obj[key], i, obj) === false)
						return;
				}
			}
		}
	};
var concat = ArrayProto.concat;



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

	
	$.call=function(func, args, context){
		context=context||this;
		switch(args.length){
			case 0:
			func.call(context);
			break;
			case 1:
			func.call(context,args[0]);
			break;
			case 2:
			func.call(context,args[0],args[1]);
			break;
			case 3:
			func.call(context,args[0],args[1],args[2]);
			break;
			case 4:
			func.call(context,args[0],args[1],args[2],args[3]);
			break;
			case 5:
			func.call(context,args[0],args[1],args[2],args[3],args[4]);
			break;
		}
	}
	
	
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
var ObjProto = Object.prototype;

var toString = ObjProto.toString;


	
	$.is$ = function(obj){return obj instanceof $.fn.constructor;}
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
	$.isArray = function(obj){
		return obj instanceof Array && obj['push'] != undefined;
	};

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
var _utilCache ={};

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
	
	
	$.extend = function(target) {
		var ukey,key;
		if (target == undefined)
			target = this;
		if (arguments.length === 1&&$.isObject(target)) { 
			for (key in target){
				ukey=key.split(':');
				if(ukey.length==1)$.fn[key] = target[key];
				else if(ukey[0]=='util') _utilCache[ukey[1]]=target[key];
			}
			return;
		} else {
			var a= slice.call(arguments, 1);
			for(var i=0,len=a.length;i<len;i++)
				for (key in a[i])
					target[key] = a[i][key];
		}
		return target;
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
		return obj.hasOwnProperty(key);
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
	 * options.data - data to pass into request.  $.queryString is called on objects
	 * options.async
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
	
	$.ajax = function(opts){
		ajax(opts);
	};


	$.get = function (url) {
		var t, data={}, dataType='html',success=empty,error=empty;
		for(var i=1,len=arguments.length;i<len;i++){
			t=arguments[i];
			switch(typeof t){
				case'string':
				if(t.indexOf('=')>-1) data=t;
				else {
					dataType=t;
				}
				break;
				case'object':
				data=t;
				break;
				case'function':
				if(success===empty)success=t;
				else error=t;
				break;
			}
		}

		return ajax({
			url : url,
			data : data,
			dataType : dataType,
			success : success,
			error:error,
		});
	}
	
	$.post = function (url) {
		var t, data={}, dataType='html',success=empty,error=empty;
		for(var i=1,len=arguments.length;i<len;i++){
			t=arguments[i];
			switch(typeof t){
				case'string':
				if(t.indexOf('=')>-1) data=t;
				else {
					dataType=t;
				}
				break;
				case'object':
				data=t;
				break;
				case'function':
				if(success===empty)success=t;
				else error=t;
				break;
			}
		}
		return ajax({
			url : url,
			type : "POST",
			data : data,
			dataType : dataType,
			success : success,
			error:error,
		});
	};

	/**
	 * Converts an object into a key/value par with an optional prefix.  Used for converting objects to a query string
	```
	var obj={
	foo:'foo',
	bar:'bar'
	}
	var kvp=$.queryString(obj,'data');
	```

	 * @param {Object} object
	 * @param {String} [prefix]前缀
	 * @return {String} Key/value pair representation
	 * @title $.queryString(object,[prefix];
	 */

	$.queryString = function (obj, prefix) {
		var str = [];
		if (obj instanceof $.fn.constructor) {
			for (var i = 0, len = obj.length; i < len; i++) {
				var k = prefix ? prefix + "[]" : obj[i].name,
				v = obj[i].value;
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


	$.parseXML = function (string) {
		return (new DOMParser).parseFromString(string, "text/xml");
	};
	
	function ajax(opts) {
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
			if ($.isObject(settings.data))
				settings.data = $.queryString(settings.data);
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
	
	function errCallback(opts){
		if($.DEBUG.open){
			if(!opts.orgError) opts.orgError=opts.error;
			else return opts.error;
			return function(e){
				var url=$.DEBUG.ajaxRedirect(opts.url,opts.data,opts.method);
				if(url)
					ajax({
						url:url,
						dataType : opts.dataType,
						success : opts.success,
						error :opts.orgError,
						orgError:1,//避免死循环
					});
			}
		}else return opts.error;
	}

var _attrCache ={};
var _propCache ={};
var _initedCache ={};

	function r_id(element) {
		if(!element)return;
		var id=parseInt(element.getAttribute('_id'))
		element.removeAttribute('_id');
		return id;
	}

		
	function has_id(element){
		if(!element)return;
		return parseInt(element.getAttribute('_id'));
	}

	
	function makeEvent(type, props) {
		var event = document.createEvent('Events'), 
		bubbles = true;
		if (props)
			for (var name in props)
				(name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name]);
		event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null);
		return event;
	};


	function cleanUpNode(node, kill){
		//kill it before it lays eggs!
		if(kill && node.dispatchEvent){
			var e = makeEvent('destroy', {bubbles:false});
			node.dispatchEvent(e);
		}
		
		var id = has_id(node);
		
		if(id){
			if(handlers[id]){
				for(var key in handlers[id])
					node.removeEventListener(handlers[id][key].e, handlers[id][key].proxy, false);
				delete handlers[id];
			}
			
			if(_attrCache[id]) delete _attrCache[id];
			if(_propCache[id]) delete _propCache[id];
			if(_initedCache[id]){
				$(node).distroy();
				delete _initedCache[id];
			}
			r_id(node);
		}
	}
	
	
	$.clean = function(node, itself, kill){
		if(!node) return;
		//cleanup children
		var elems = $('[_id]',node);
		if(elems.length > 0) 
			for(var i=0,len=elems.length;i<len;i++){
				cleanUpNode(elems[i], kill);
			}
		//cleanUp this node
		if(itself) cleanUpNode(node, kill);
	}
var handlers ={};
var __id =1;

		
	function _id(element) {
		if(!element)return;
		var id=parseInt(element.getAttribute('_id'));
		if(id) return id;
		else{
			id=__id++;
			element.setAttribute('_id',id);
			return id;
		}
	}
var fragementRE = /^\s*<(\w+)[^>]*>/



	function _insertFragments(jqm,container,insert){
		var frag=document.createDocumentFragment();
		if(insert){
			for(var j=jqm.length-1;j>=0;j--)
			{
				frag.insertBefore(jqm[j],frag.firstChild);
			}
			container.insertBefore(frag,container.firstChild);
		
		}
		else {
		
			for(var j=0;j<jqm.length;j++)
				frag.appendChild(jqm[j]);
			container.appendChild(frag);
		}
		frag=null;
	}


	$.extend({

		
		html: function(html,init) {
			if (this.length === 0)
				return this;
			if (html === undefined)
				return this[0].innerHTML.replace(/_id\=\"[\w\,]*?\"/ig,'');
			for (var i = 0,len=this.length; i <len ; i++) {
				$.clean(this[i], false, true);
				this[i].innerHTML = html;
				if(typeof init !== false){
					this.init(init);
				}
			}
			return this;
		},

		text: function(text) {
			if (this.length === 0)
				return this;
			if (text === undefined)
				return this[0].textContent;
			for (var i = 0,len=this.length; i <len ; i++) {
				this[i].textContent = text;
			}
			return this;
		},
		

		
		remove: function(selector) {
			var elems = $(this).filter(selector);
			if (elems == undefined)
				return this;
			for (var i = 0,len=elems.length; i <len ; i++) {
				$.clean(elems[i], true, true);
				elems[i].parentNode.removeChild(elems[i]);
			}
			return this;
		},
		


		
		append: function(element, init, insert, clone) {
			if(typeof clone=='undefined') clone=true;
			if (element && element.length != undefined && element.length === 0)
				return this;
			if ($.isArray(element) || $.isObject(element))
				element = $(element);
			var i,cloned;
			
			
			for (i = 0; i < this.length; i++) {
				
				if (element.length && typeof element != "string") {
					cloned = clone?$(element).clone(1):$(element);
					_insertFragments(cloned,this[i],insert);
					if(typeof init !== false){
						cloned.init(init);
					}
				} else {
					var obj =fragementRE.test(element)?$(element):undefined;
					if (obj == undefined || obj.length == 0) {
						obj = document.createTextNode(element);
					}
					if (obj.nodeName != undefined && obj.nodeName.toLowerCase() == "script" && (!obj.type || obj.type.toLowerCase() === 'text/javascript')) {
						window.eval(obj.innerHTML);
					} else if(obj instanceof $.fn.constructor) {
						_insertFragments(obj,this[i],insert);
						if(typeof init !== false){
							obj.init(init);
						}
					} else {
						insert ? this[i].insertBefore(obj, this[i].firstChild) : this[i].appendChild(obj);
						if(typeof init !== false){
							obj.init(init);
						}
						
					}
				}
			}
			return this;
		},
		
		appendTo:function(selector,init){
			var tmp=$(selector);
			tmp.append(this,init,false,false);
			return this;
		},
		
		prependTo:function(selector,init){
			var tmp=$(selector);
			tmp.append(this, init, true, false);
			return this;
		},
		
		prepend: function(element,init) {
			return this.append(element, init, true,true);
		},
		
		beforeTo: function(target, init, after) {
			if (this.length == 0)
				return this;
			var targets = $(target);
			if (!targets||!targets.parent().length)
				return this;
			for(var j=0,l=targets.length;j<l;j++){
				target = targets[j];
				for (var i = 0; i < this.length; i++)
				{
					after ? target.parentNode.insertBefore(this[i], target.nextSibling) : target.parentNode.insertBefore(this[i], target);
				}
			}
			if(typeof init !== false){
				this.init(init);
			}
			return this;
		},
		
	   afterTo: function(target,init) {
			this.beforeTo(target,init, true);
		},
		
		before: function(content, init) {
			var obj=$(content);
			if((!obj||!obj.length)&&typeof content == 'string')
				obj =$(document.createTextNode(content))
			obj.beforeTo(this,init);
			return this;
		},
		
	   after: function(content,init) {
			var obj=$(content);
			if((!obj||!obj.length)&&typeof content == 'string')
				obj =$(document.createTextNode(content))
			obj.beforeTo(this,init,true);
		},

		
		clone: function(deep) {
			deep = deep === false ? false : true;
			if (this.length == 0)
				return this;
			var elems = [],el,id,oid,els;
			for (var i = 0,len=this.length; i < len; i++) {
				el=$(this[i].cloneNode(deep));
				if(deep){
					if(el.attr('[_id]')){
						clone(el[0]);
					}
					el.find('[_id]').each(function(index, element) {
						clone(this);
					});
				}else {
					r_id(el[0]);
					el.find('[_id]').each(function(index, element) {
						r_id(this);
					});
				}
				elems.push(el[0]);
			}
			
			return $(elems);
			function clone(elems){
				oid=r_id(elems);
				id=_id(elems);
				if(_attrCache[oid])_attrCache[id]=$.clone(_attrCache[oid]);
				if(_propCache[oid])_propCache[id]=$.clone(_propCache[oid]);
				if(_initedCache[oid])_initedCache[id]=$.clone(_initedCache[oid]);
				if(handlers[oid])handlers[id]=$.clone(handlers[oid])
			}
		},

	});

	function shim_id(element) {
		if(!element)return;
		var id=parseInt(element.getAttribute('_id'));
		var keys=Object.keys;
		if((id)&&
			(!_attrCache[id]||!keys(_attrCache[id]).length)&&
			(!_propCache[id]||!keys(_propCache[id]).length)&&
			(!_initedCache[id]||!_initedCache[id].length)&&
			(!handlers[id]||!handlers[id].length)) 
				element.removeAttribute('_id');
	}


	$.extend({
		attr: function(attr, value) {
			var id,el;
			if (this.length === 0)
				return (value === undefined) ? undefined : this;            
			if (value === undefined && !$.isObject(attr)) {
				id=has_id(this[0]);
				return (id&&_attrCache[id]&&_attrCache[id][attr])?_attrCache[id][attr]:this[0].getAttribute(attr);
			}
			for (var i = 0,len=this.length; i <len ; i++) {
				id=has_id(this[i]);
				el=this[i];
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
					shim_id(el);
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
				el=this[i];
				id=has_id(el);
				if(!id) continue;
				for(var j=0,lem=attrs.length;j<lem;j++){
					at=attrs[j];
					el.removeAttribute(at);
					if(id&&_attrCache[id]&&_attrCache[id][at])
						delete _attrCache[id][at];
				}
				shim_id(el);
			}
			return this;
		},

		
		prop: function(prop, value) {
			var id,el;
			if (this.length === 0)
				return (value === undefined) ? undefined : this;          
			if (value === undefined && !$.isObject(prop)) {
				
				var res;id=has_id(this[0]);
				var val = (id&&_propCache[id][prop])?(id&&_propCache[id][prop]):!(res=this[0][prop])&&prop in this[0]?this[0][prop]:res;
				return val;
			}
			for (var i = 0,len=this.length; i <len ; i++) {
				
				el=this[i];
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
					shim_id(el);
				}
				else{
					el[prop]= value;
				}
			}
			return this;
		},
		
		removeProp: function(prop) {
			var p=prop.split(/\s+|\,/g),el,pr,id;
			for (var i = 0,len=this.length; i <len ; i++) {
				el=this[i];
				id=has_id(el);
				if(!id) continue;
				for (var j = 0,lem=p.length; j <lem ; j++) {
					pr=p[j];
					if(el[pr])
						delete el[pr];
					if(id&&_propCache[id]&&_propCache[id][pr]){
							delete _propCache[id][pr];
					}
				}
				shim_id(el);
			}
			return this;
		},


	
		
		parseForm: function() {
			if (this.length == 0)
				return "";
			var params = {},elems,elem,type,tmp;
			for (var i = 0,len=this.length; i <len ; i++) {
				if(elems= this[i].elements){
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
				return this[0].value;
			for (var i = 0,len=this.length; i <len ; i++) {
				this[i].value = value;
			}
			return this;
		},
		
		
		data: function(key, value) {
			return this.attr('data-' + key, value);
		},
		

		_id:function(make){
			if(make)return _id(this[0]);
			return has_id(this[0]);
		},
		
		clean:function(){
			$.clean(this);
		},


	});


	$.extend({

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

function siblings(nodes, element) {
		var elems = [];
		if (nodes == undefined)
			return elems;
		
		for (; nodes; nodes = nodes.nextSibling) {
			if (nodes.nodeType == 1 && nodes !== element) {
				elems.push(nodes);
			}
		}
		return elems;
	}


	$.extend({

		setupOld: function(params) {
			if (params == undefined)
				return $();
			params.oldElement = this;
			return params;
		},
		
		//如果callback返回数据，则返回[数据]，否则默认返回this
		each: function(callback) {
			var el=this,tmp,returns=[];
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
				tmpElems = $(sel, this[i]);
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
				var tmp=this[i];
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
				elems = elems.concat(siblings(this[i].firstChild));
			}
			return this.setupOld($((elems)).filter(selector));
		
		},
		
		siblings: function(selector) {
			if (this.length == 0)
				return this;
			var elems = [];
			for (var i = 0,len=this.length; i <len ; i++) {
				if (this[i].parentNode)
					elems = elems.concat(siblings(this[i].parentNode.firstChild, this[i]));
			}
			return this.setupOld($(elems).filter(selector));
		},
		
		closest: function(selector, context) {
			if (this.length == 0)
				return this;
			var elems = [], 
			cur = this[0];
			
			var start = $(selector, context);
			if (start.length == 0)
				return $();
			while (cur && start.indexOf(cur) == -1) {
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
				var val = this[i];
				if (val.parentNode && $(selector, val.parentNode).index(val) >= 0)
					elems.push(val);
			}
			return this.setupOld($(unique(elems)));
		},
		
		not: function(selector) {
			if (this.length == 0)
				return this;
			var elems = [];
			for (var i = 0,len=this.length; i <len ; i++) {
				var val = this[i];
				if (val.parentNode && $(selector, val.parentNode).indexOf(val) == -1)
					elems.push(val);
			}
			return this.setupOld($(unique(elems)));
		},
		
		add:function(elems){
			_shimNodes(elems,this);
			return this;
		},
		
		end: function() {
			return this.oldElement != undefined ? this.oldElement : $();
		},
		
		
	   
		eq:function(ind){
			var index;
			index = ind == undefined ? 0 : ind;
			if (index < 0)
				index += this.length;
			return $((this[index]) ? this[index] : undefined);
		},
		
		index:function(elem){
			return elem?this.indexOf($(elem)[0]):this.parent().children().indexOf(this[0]);
		},
		

	});


	$.extend({

		
		css: function(attribute, value, obj) {
			var toAct = obj != undefined ? obj : this[0];
			if (this.length === 0)
				return this;
			if (value == undefined && typeof (attribute) === "string") {
				var styles = window.getComputedStyle(toAct);
				return  toAct.style[attribute] ? toAct.style[attribute]: window.getComputedStyle(toAct)[attribute] ;
			}
			for (var i = 0,len=this.length; i <len ; i++) {
				if ($.isObject(attribute)) {
					for (var j in attribute) {
						this[i].style[j] = attribute[j];
					}
				} else {
					this[i].style[attribute] = value;
				}
			}
			return this;
		},
		
		hide: function() {
			if (this.length === 0)
				return this;
			for (var i = 0,len=this.length; i <len ; i++) {
				if (this.css("display", null, this[i]) != "none") {
					this[i].setAttribute("jqmOld_display", this.css("display", null, this[i]));
					this[i].style.display = "none";
				}
			}
			return this;
		},
		
		show: function() {
			if (this.length === 0)
				return this;
			for (var i = 0,len=this.length; i <len ; i++) {
				if (this.css("display", null, this[i]) == "none") {
					this[i].style.display = this[i].getAttribute("jqmOld_display") ? this[i].getAttribute("jqmOld_display") : 'block';
					this[i].removeAttribute("jqmOld_display");
				}
			}
			return this;
		},
		
		toggle: function(show) {
			var show2 = show === true ? true : false;
			for (var i = 0,len=this.length; i <len ; i++) {
				if (window.getComputedStyle(this[i])['display'] !== "none" || (show !== undefined && show2 === false)) {
					this[i].setAttribute("jqmOld_display", this[i].style.display)
					this[i].style.display = "none";
				} else {
					this[i].style.display = this[i].getAttribute("jqmOld_display") != undefined ? this[i].getAttribute("jqmOld_display") : 'block';
					this[i].removeAttribute("jqmOld_display");
				}
			}
			return this;
		},
		
		
		addClass: function(name) {
			var el;
			for (var i = 0,len=this.length; i <len ; i++) {
				el = this[i];
				el.classList.add(name);
			}
			return this;
		},
		
		removeClass: function(name) {
			var el;
			for (var i = 0,len=this.length; i <len ; i++) {
				el = this[i];
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
				el = this[i];
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
				el = this[i];
				el.classList.toggle(name);
			}
			return this;
		},
		
		hasClass: function(name, element) {
			if (this.length === 0)
				return false;
			if (!element)
				element = this[0];
			return element.classList.contains(name);
		},

		
		offset: function() {
			if (this.length === 0)
				return this;
			if(this[0]==window)
				return {
					left:0,
					top:0,
					right:0,
					bottom:0,
					width:window.innerWidth,
					height:window.innerHeight
				}
			else
				var obj = this[0].getBoundingClientRect();
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
			if(this[0]==this[0].window)
				return window.innerHeight;
			if(this[0].nodeType==this[0].DOCUMENT_NODE)
				return this[0].documentElement['offsetheight'];
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
			if(this[0]==this[0].window)
				return window.innerWidth;
			if(this[0].nodeType==this[0].DOCUMENT_NODE)
				return this[0].documentElement['offsetwidth'];
			else{
				var tmpVal=this.css("width").replace("px","");
				if(tmpVal)
					return tmpVal
				else
				   return this.offset().width;
			}
		},
	});


	//	
	//	[data-util="chzn"]	使用$().chzn()自动初始化；使用$().chzn_()或$().chznDestroy()反初始化
	//	
	//	初始化后更改属性 [data-destroy="chzn"]
	//	

	
	$.fn.init = function (s) {
		var util,ics;
		var elems=this.find('[data-util]')
		elems.add(this.filter('[data-util]'));
		if(!s){
			elems.each(function(){
				var me=$(this);
				if(s=me.data('util')){
					this.removeAttribute('data-util');
					if(typeof s=='string') s=s.split(/\s|\,/g);
					ics=_initedCache[_id(this)] =_initedCache[_id(this)]||[];
					for(var i=0,len=s.length;i<len;i++){
						if(ics.indexOf(s[i])==-1){//过滤已初始化
							ics.push(s[i]);
							_utilCache[s[i]].call($(this),this);
						}
					}
				}
				
			});
		}else{
			if(typeof s=='string') s=s.split(/\s|\,/g);
			elems.each(function(){
				ics=_initedCache[_id(this)] =_initedCache[_id(this)]||[];
				for(var i=0,len=s.length;i<len;i++){
					if(ics.indexOf(s[i])==-1){//过滤已初始化
						ics.push(s[i]);
						_utilCache[s[i]].call($(this),this);
						
					}
				}
			});
			
		}
		return this;
	}
	$.fn.destroy=function(s){
		var id,ics,index;
		var elems=this.find('[_id]')
		elems.add(this.filter('[_id]'));
		if(s){
			if(typeof s=='string') s=s.split(/\s|\,/g);
			for(var k=0,l=elems.length;k<l;k++){
				id=has_id(elems[k]);
				if(!id||!(ics=_initedCache[id])||!ics.length) return;
				for(var i=0,len=s.length;i<len;i++){
					if((index=ics.indexOf(s[i]))!=-1){//过滤已反初始化
						_utilCache[s[i]+'_'].call($(elems[k]),elems[k]);
						ics.splice(index,1);
					}
				}
				if(ics.length==0){
					delete _initedCache[id];
					shim_id(elems[k]);
				}
			}
		}else{
			for(var k=0,l=elems.length;k<l;k++){
				id=has_id(elems[k]);
				if(!id||!(ics=_initedCache[id])||!ics.length) return;
				for(var i=0,len=ics.length;i<len;i++){
					_utilCache[ics[i]+'_'].call($(elems[k]),elems[k]);
				}
				delete _initedCache[id];
				shim_id(elems[k]);
			}
			
		}
		return this;
	}



	function eachEvent(events, fn, iterator) {
		if ($.isObject(events))
			$.each(events, iterator);
		else{
			var e=events.split(/\s|\,/);
			for(var i=0,len=e.length;i<len;i++){
				iterator(e[i], fn);
			};
		}
	
	}

	function parse(event) {
		var parts = ('' + event).split('.');
		return {
			e: parts[0],
			ns: parts.slice(1).sort().join(' ')
		};
	}


	function add(element, events, fn, selector, getDelegate) {
		var id = _id(element), 
		set = (handlers[id] || (handlers[id] = []));
		eachEvent(events, fn, function(event, fn) {
			var delegate = getDelegate && getDelegate(fn, event), 
			callback = delegate || fn;
			var proxyfn = function(event) {
				var result = callback.apply(element, [event].concat(event.data));
				if (result === false)
					event.preventDefault();
				return result;
			};
			var handler = $.extend(parse(event), {
				fn: fn,
				proxy: proxyfn,
				sel: selector,
				del: delegate,
				i: set.length
			});
			set.push(handler);
			element.addEventListener(handler.e, proxyfn, false);
		});
		//element=null;
	}

	function _bind(elems,event, callback) {
		for (var i = 0,len=elems.length; i <len ; i++) {
			add(elems[i], event, callback);
		}
	};


	var returnTrue = function() {
		return true
	}, 
	returnFalse = function() {
		return false
	}, 
	eventMethods = {
		preventDefault: 'isDefaultPrevented',
		stopImmediatePropagation: 'isImmediatePropagationStopped',
		stopPropagation: 'isPropagationStopped'
	};
	
	function createProxy(event) {
		var proxy = $.extend({
			originalEvent: event
		}, event);
		$.each(eventMethods, function(name, predicate) {
			proxy[name] = function() {
				this[predicate] = returnTrue;					
				if (name == "stopImmediatePropagation" || name == "stopPropagation"){
					event.cancelBubble = true;
					if(!event[name])
						return;
				}
				return event[name].apply(event, arguments);
			};
			proxy[predicate] = returnFalse;
		})
		return proxy;
	}

	
	function _delegate(elems,selector, event, callback) {
		for (var i = 0,len=elems.length; i <len ; i++) {
			var element = elems[i];
			add(element, event, callback, selector, function(fn) {
				return function(e) {
					var evt, match,tmp;
					match = $(e.target).closest(selector, element)[0];
					if (match) {
						evt = $.extend(createProxy(e), {
							currentTarget: match,
							liveFired: element
						});
						return fn.apply(match, [evt].concat([].slice.call(arguments, 1)));
					}
				}
			});
		}
	};

	
	function findHandlers(element, event, fn, selector) {
		event = parse(event);
		if (event.ns)
			var matcher = matcherFor(event.ns);
		return (has_id(element)&&handlers[has_id(element)] || []).filter(function(handler) {
			return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || handler.fn == fn || (typeof handler.fn === 'function' && typeof fn === 'function' && "" + handler.fn === "" + fn)) && (!selector || handler.sel == selector);
		});
	}
	
		
	function matcherFor(ns) {
		return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
	}


	function remove(element, events, fn, selector) {

		var id = has_id(element);
		if(!id)return;
		eachEvent(events || '', fn, function(event, fn) {
			var hdls=findHandlers(element, event, fn, selector),hdl;
			for(var i=0,len=hdls.length;i<len;i++){
				hdl=hdls[i];
				delete handlers[id][hdl.i];
				handlers[id].length--;
				element.removeEventListener(hdl.e, hdl.proxy, false);
			};
		});
		shim_id(element);
	}

	function _unbind(elems,event, callback) {
		for (var i = 0,len=elems.length; i <len ; i++) {
			remove(elems[i], event, callback);
		}
	};


	function _undelegate(elems,selector, event, callback) {
		for (var i = 0,len=elems.length; i <len ; i++) {
			remove(elems[i], event, callback, selector);
		}
		return this;
	}

	
	$.fn.on = function(event, selector, callback) {
		return selector === undefined || $.isFunction(selector) ? _bind(this,event, selector) : _delegate(this,selector, event, callback);
	};
   
	$.fn.off = function(event, selector, callback) {
		return selector === undefined || $.isFunction(selector) ? _unbind(this,event, selector) : _undelegate(this,selector, event, callback);
	};

	$.fn.one = function(event, callback) {
		return this.each(function(i, element) {
			var el=this;
			add(this, event, callback, null, function(fn, type) {
				return function() {
					var result = fn.apply(el, arguments);
					remove(el, type, fn);
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
			this[i].dispatchEvent(event)
		}
		return this;
	};
	
	var eventtrigger=["click","keydown","keyup","keypress","submit","load","resize","change","select","error"];
	for(var i=0,len=eventtrigger.length;i<len;i++)
		(function(i){
			$.fn[eventtrigger[i]]=function(cb){
				return cb?_bind(this,eventtrigger[i],cb):this.trigger(eventtrigger[i]);
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