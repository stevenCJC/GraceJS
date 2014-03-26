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
