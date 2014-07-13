define(['$'], function($) {

	var each = $.each = function (obj, iterator, context) {
		if (obj == null)
			return;
		if (obj.length === +obj.length) {
			if(context) for (var i = 0, l = obj.length; i < l; i++) {
					if (iterator.call(context, obj[i], i, obj) === false)
						return;
				}
			else for (var i = 0, l = obj.length; i < l; i++) {
					if (iterator.call(obj[i], obj[i], i, obj) === false)
						return;
				}
		} else {
			if(context) for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (iterator.call(context, obj[key], key, obj) === false)
						return;
				}
			}
			else  for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (iterator.call(obj[key], obj[key], i, obj) === false)
						return;
				}
			}
		}
	};
	return each;
});