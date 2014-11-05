define(['$','blk/_/var/slice'], function ($,slice) {

	$.extend = function(target) {
		if (target == undefined)
			target = this;
		if (arguments.length === 1) { 
			for (var key in target)
				$.fn[key] = target[key];
			return;
		} else {
			var a= slice.call(arguments, 1);
			for(var i=0,len=a.length;i<len;i++)
				for (var key in a[i])
					target[key] = a[i][key];
		}
		return target;
	};
	return $;
});