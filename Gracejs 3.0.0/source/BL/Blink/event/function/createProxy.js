define(['$'], function ($) {

	var returnTrue = function() {
		return true
	}, 
	returnFalse = function() {
		return false
	}, 
	eventMethods = {
		preventDefault: 'isDefaultPrevented',
		stopImmediatePropagation: 'isImmediatePropagationStopped',
		stopPropagation: 'isPropagationStopped'
	};
	
	function createProxy(event) {
		var proxy = $.extend({
			originalEvent: event
		}, event);
		$.each(eventMethods, function(name, predicate) {
			proxy[name] = function() {
				this[predicate] = returnTrue;					
				if (name == "stopImmediatePropagation" || name == "stopPropagation"){
					event.cancelBubble = true;
					if(!event[name])
						return;
				}
				return event[name].apply(event, arguments);
			};
			proxy[predicate] = returnFalse;
		})
		return proxy;
	}
	return createProxy;
});