define(['$','./add','./createProxy'], function ($,add,createProxy) {
	
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
return _delegate;
});