define([], function () {


	// Collection Functions
	// --------------------

	// The cornerstone, an `each` implementation, aka `forEach`.
	// Handles objects with the built-in `forEach`, arrays, and raw objects.
	// Delegates to **ECMAScript 5**'s native `forEach` if available.
	


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

	
	



	return _;
});
