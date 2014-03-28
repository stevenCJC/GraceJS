define(['blk/event/var/handlers','blk/function/has_id','./parse'], function (handlers,has_id,parse) {
	
	function findHandlers(element, event, fn, selector) {
		event = parse(event);
		if (event.ns)
			var matcher = matcherFor(event.ns);
		return (has_id(element)&&handlers[has_id(element)] || []).filter(function(handler) {
			return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || handler.fn == fn || (typeof handler.fn === 'function' && typeof fn === 'function' && "" + handler.fn === "" + fn)) && (!selector || handler.sel == selector);
		});
	}
	
		
	function matcherFor(ns) {
		return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
	}
	
	return findHandlers;
});