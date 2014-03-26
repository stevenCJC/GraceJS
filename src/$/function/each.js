


$.each = function(elements, callback) {
		var i, key;
		if ($.isArray(elements))//需要修改
			for(var i=0,len=elements.length;i<len;i++)
				if (callback(i, elements[i]) === false) return elements;
		else if ($.isObject(elements))
			for (key in elements) {
				if (!elements.hasOwnProperty(key))
					continue;
				if (callback(key, elements[key]) === false)
					return elements;
			}
		return elements;
	};