

$.extend = function(target) {
		if (target == undefined)
			target = this;
		if (arguments.length === 1) { 
			for (var key in target)
				this[key] = target[key];
			return this;
		} else {
			var a= slice.call(arguments, 1);
			for(var i=0,len=a.length;i<len;i++)
				for (var key in a[i])
					target[key] = a[i][key];
		}
		return target;
	};
