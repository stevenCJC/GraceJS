define(['$','./each','./var/ArrayProto','./var/slice','./var/concat'], function($,each,ArrayProto,slice,concat) {

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

	
	



	return $;
});
