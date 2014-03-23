define([], function () {

	// Save the previous value of the `_` variable.
	var breaker = {};

	// Save bytes in the minified (but not gzipped) version:
	var ArrayProto = Array.prototype,
	ObjProto = Object.prototype,
	FuncProto = Function.prototype;

	// Create quick reference variables for speed access to core prototypes.
	var push = ArrayProto.push,
	slice = ArrayProto.slice,
	concat = ArrayProto.concat,
	toString = ObjProto.toString,
	hasOwnProperty = ObjProto.hasOwnProperty;

	// All **ECMAScript 5** native function implementations that we hope to use
	// are declared here.
	var
	nativeForEach = ArrayProto.forEach,
	nativeMap = ArrayProto.map,
	nativeReduce = ArrayProto.reduce,
	nativeReduceRight = ArrayProto.reduceRight,
	nativeFilter = ArrayProto.filter,
	nativeEvery = ArrayProto.every,
	nativeSome = ArrayProto.some,
	nativeIndexOf = ArrayProto.indexOf,
	nativeLastIndexOf = ArrayProto.lastIndexOf,
	nativeIsArray = Array.isArray,
	nativeKeys = Object.keys,
	nativeBind = FuncProto.bind;

	// Create a safe reference to the Underscore object for use below.
	var _ = function (obj) {
		if (obj instanceof _)
			return obj;
		if (!(this instanceof _))
			return new _(obj);
		this._wrapped = obj;
	};

	// Collection Functions
	// --------------------

	// The cornerstone, an `each` implementation, aka `forEach`.
	// Handles objects with the built-in `forEach`, arrays, and raw objects.
	// Delegates to **ECMAScript 5**'s native `forEach` if available.
	var each = _.each = function (obj, iterator, context) {
		if (obj == null)
			return;
		if (nativeForEach && obj.forEach === nativeForEach) {
			obj.forEach(iterator, context);
		} else if (obj.length === +obj.length) {
			for (var i = 0, l = obj.length; i < l; i++) {
				if (iterator.call(context, obj[i], i, obj) === breaker)
					return;
			}
		} else {
			for (var key in obj) {
				if (_.hasKey(obj, key)) {
					if (iterator.call(context, obj[key], key, obj) === breaker)
						return;
				}
			}
		}
	};

	// Return the results of applying the iterator to each element.
	// Delegates to **ECMAScript 5**'s native `map` if available.
	_.map = function (obj, iterator, context) {
		var results = [];
		if (obj == null)
			return results;
		if (nativeMap && obj.map === nativeMap)
			return obj.map(iterator, context);
		each(obj, function (value, index, list) {
			results[results.length] = iterator.call(context, value, index, list);
		});
		return results;
	};

	// Return the first value which passes a truth test. Aliased as `detect`.
	_.find = function (obj, iterator, context) {
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
	_.filter = function (obj, iterator, context) {
		var results = [];
		if (obj == null)
			return results;
		if (nativeFilter && obj.filter === nativeFilter)
			return obj.filter(iterator, context);
		each(obj, function (value, index, list) {
			if (iterator.call(context, value, index, list))
				results[results.length] = value;
		});
		return results;
	};

	// Determine if at least one element in the object matches a truth test.
	// Delegates to **ECMAScript 5**'s native `some` if available.
	// Aliased as `any`.
	var any = function (obj, iterator, context) {
		iterator || (iterator = _.identity);
		var result = false;
		if (obj == null)
			return result;
		if (nativeSome && obj.some === nativeSome)
			return obj.some(iterator, context);
		each(obj, function (value, index, list) {
			if (result || (result = iterator.call(context, value, index, list)))
				return breaker;
		});
		return !!result;
	};

	// Determine if the array or object contains a given value (using `===`).
	// Aliased as `include`.
	_.contains = function (obj, target) {
		if (obj == null)
			return false;
		if (nativeIndexOf && obj.indexOf === nativeIndexOf)
			return obj.indexOf(target) != -1;
		return any(obj, function (value) {
			return value === target;
		});
	};

	// Convenience version of a common use case of `map`: fetching a property.
	_.pluck = function (obj, key) {
		return _.map(obj, function (value) {
			return value[key];
		});
	};

	// Convenience version of a common use case of `filter`: selecting only objects
	// containing specific `key:value` pairs.
	_.where = function (obj, attrs, first) {
		if (_.isEmpty(attrs))
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
	_.findWhere = function (obj, attrs) {
		return _.where(obj, attrs, true);
	};

	// Return the number of elements in an object.
	_.size = function (obj) {
		if (obj == null)
			return 0;
		return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
	};

	// Return a version of the array that does not contain the specified value(s).
	_.without = function (array) {
		return _.difference(array, slice.call(arguments, 1));
	};

	// Produce a duplicate-free version of the array. If the array has already
	// been sorted, you have the option of using a faster algorithm.
	// Aliased as `unique`.
	_.uniq = _.unique = function (array, isSorted, iterator, context) {
		if (_.isFunction(isSorted)) {
			context = iterator;
			iterator = isSorted;
			isSorted = false;
		}
		var initial = iterator ? _.map(array, iterator, context) : array;
		var results = [];
		var seen = [];
		each(initial, function (value, index) {
			if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
				seen.push(value);
				results.push(array[index]);
			}
		});
		return results;
	};

	// Produce an array that contains the union: each distinct element from all of
	// the passed-in arrays.
	_.union = function () {
		return _.uniq(concat.apply(ArrayProto, arguments));
	};

	// Take the difference between one array and a number of other arrays.
	// Only the elements present in just the first array will remain.
	_.difference = function (array) {
		var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
		return _.filter(array, function (value) {
			return !_.contains(rest, value);
		});
	};

	// Delays a function for the given number of milliseconds, and then calls
	// it with the arguments supplied.
	_.delay = function (func, wait) {
		var args = slice.call(arguments, 2);
		return setTimeout(function () {
			return func(args);
		}, wait);
	};

	// Defers a function, scheduling it to run after the current call stack has
	// cleared.
	_.defer = function (func) {
		return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
	};

	// Returns a function, that, when invoked, will only be triggered at most once
	// during a given window of time.
	_.throttle = function (func, wait) {
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
	_.debounce = function (func, wait, immediate) {
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
	_.once = function (func) {
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
	_.after = function (times, func) {
		if (times <= 0)
			return func();
		return function () {
			if (--times < 1) {
				return func.apply(this, arguments);
			}
		};
	};

	// Object Functions
	// ----------------

	// Retrieve the names of an object's properties.
	// Delegates to **ECMAScript 5**'s native `Object.keys`
	_.keys = nativeKeys || function (obj) {
		if (obj !== Object(obj))
			throw new TypeError('Invalid object');
		var keys = [];
		for (var key in obj)
			if (_.hasKey(obj, key))
				keys[keys.length] = key;
		return keys;
	};

	// Retrieve the values of an object's properties.
	_.values = function (obj) {
		var values = [];
		for (var key in obj)
			if (_.hasKey(obj, key))
				values.push(obj[key]);
		return values;
	};

	// Extend a given object with all the properties in passed-in object(s).
	_.extend = function (obj) {
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
	_.pick = function (obj) {
		var copy = {};
		var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
		each(keys, function (key) {
			if (key in obj)
				copy[key] = obj[key];
		});
		return copy;
	};

	// Return a copy of the object without the blacklisted properties.
	_.omit = function (obj) {
		var copy = {};
		var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
		for (var key in obj) {
			if (!_.contains(keys, key))
				copy[key] = obj[key];
		}
		return copy;
	};

	// Create a (shallow-cloned) duplicate of an object.
	_.clone = function (obj) {
		if (!_.isObject(obj))
			return obj;
		return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	};

	// Invokes interceptor with the obj, and then returns obj.
	// The primary purpose of this method is to "tap into" a method chain, in
	// order to perform operations on intermediate results within the chain.
	_.tap = function (obj, interceptor) {
		interceptor(obj);
		return obj;
	};

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
	_.isArray = nativeIsArray || function (obj) {
		return toString.call(obj) == '[object Array]';
	};

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

	// Shortcut function for checking if an object has a given property directly
	// on itself (in other words, not on a prototype).
	_.hasKey = function (obj, key) {
		return hasOwnProperty.call(obj, key);
	};

	// Return a random integer between min and max (inclusive).
	_.random = function (min, max) {
		if (max == null) {
			max = min;
			min = 0;
		}
		return min + Math.floor(Math.random() * (max - min + 1));
	};

	// Generate a unique integer id (unique within the entire client session).
	// Useful for temporary DOM ids.
	var idCounter = 0;
	_.uniqueId = function (prefix) {
		var id = ++idCounter + '';
		return prefix ? prefix + id : id;
	};

	return _;
});
