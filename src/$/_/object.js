// Object Functions
	// ----------------

	// Retrieve the names of an object's properties.
	// Delegates to **ECMAScript 5**'s native `Object.keys`
	_.keys = nativeKeys

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
	// Shortcut function for checking if an object has a given property directly
	// on itself (in other words, not on a prototype).
	_.hasKey = function (obj, key) {
		return hasOwnProperty.call(obj, key);
	};