


	
	function eachEvent(events, fn, iterator) {
		if ($.isObject(events))
			$.each(events, iterator);
		else{
			var e=events.split(/\s|\,/);
			for(var i=0,len=e.length;i<len;i++){
				iterator(e[i], fn);
			};
		}
	}