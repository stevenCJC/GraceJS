define([], function() {

	function each(obj, iterator) {
		if (!obj)
			return;
		if (!iterator)
			throw 'iterator is null';
		
		if (obj.length === +obj.length) {
			for (var i = 0, l = obj.length; i < l; i++) {
				if (iterator(obj[i],i) === false)
					return;
			}
		} else {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (iterator(obj[key],i) === false)
						return;
				}
			}
		}
	};
	
	return each;
});