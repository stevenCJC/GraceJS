define(['$','./each','./var/toString'], function($,each,toString) {
	
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
	
	return $;
});