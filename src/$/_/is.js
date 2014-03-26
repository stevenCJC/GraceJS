
	// Is a given array, string, or object empty?
	// An "empty" object has no enumerable own-properties.
	_.isEmpty = function (obj) {
		if (obj == null)
			return true;
		if (_.isArray(obj) || _.isString(obj))
			return obj.length === 0;
		for (var key in obj)
			if (_.hasKey(obj, key))
				return false;
		return true;
	};

	// Is a given value a DOM element?
	_.isElement = function (obj) {
		return !!(obj && obj.nodeType === 1);
	};

	// Is a given value an array?
	// Delegates to ECMA5's native Array.isArray
	_.isArray = nativeIsArray;

	// Is a given variable an object?
	_.isObject = function (obj) {
		return obj === Object(obj);
	};

	// Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
	each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function (name) {
		_['is' + name] = function (obj) {
			return toString.call(obj) == '[object ' + name + ']';
		};
	});

	// Define a fallback version of the method in browsers (ahem, IE), where
	// there isn't any inspectable "Arguments" type.
	if (!_.isArguments(arguments)) {
		_.isArguments = function (obj) {
			return !!(obj && _.hasKey(obj, 'callee'));
		};
	}

	// Optimize `isFunction` if appropriate.
	if (typeof(/./) !== 'function') {
		_.isFunction = function (obj) {
			return typeof obj === 'function';
		};
	}

	// Is a given object a finite number?
	_.isFinite = function (obj) {
		return isFinite(obj) && !isNaN(parseFloat(obj));
	};

	// Is the given value `NaN`? (NaN is the only number which does not equal itself).
	_.isNaN = function (obj) {
		return _.isNumber(obj) && obj != +obj;
	};

	// Is a given value a boolean?
	_.isBoolean = function (obj) {
		return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
	};

	// Is a given value equal to null?
	_.isNull = function (obj) {
		return obj === null;
	};

	// Is a given variable undefined?
	_.isUndefined = function (obj) {
		return obj === void 0;
	};
