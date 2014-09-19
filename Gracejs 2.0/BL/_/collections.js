define(['$'], function($) {

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

	return $;
});