define(['BL/Blink/event/var/handlers','blk/function/has_id','blk/function/shim_id','./eachEvent','./findHandlers'], function (handlers,has_id,shim_id,eachEvent,findHandlers) {

	function remove(element, events, fn, selector) {

		var id = has_id(element);
		if(!id)return;
		eachEvent(events || '', fn, function(event, fn) {
			var hdls=findHandlers(element, event, fn, selector),hdl;
			for(var i=0,len=hdls.length;i<len;i++){
				hdl=hdls[i];
				delete handlers[id][hdl.i];
				handlers[id].length--;
				element.removeEventListener(hdl.e, hdl.proxy, false);
			};
		});
		shim_id(element);
	}
	
	return remove;
});