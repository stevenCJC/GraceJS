

	function remove(element, events, fn, selector) {
		
		var id = _id(element);
		eachEvent(events || '', fn, function(event, fn) {
			var hdl=findHandlers(element, event, fn, selector)
			for(var i=0,len=hdl.length;i<len;i++){
				delete hdl[i][id][hdl[i].i];
				element.removeEventListener(handler.e, handler.proxy, false);
			};
		});
	}
