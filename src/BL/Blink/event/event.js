define(['$'], function ($) {
	
	$.fn.on = function(event, selector, callback) {
		return selector === undefined || $.isFunction(selector) ? _bind(this.elems,event, selector) : _delegate(this.elems,selector, event, callback);
	};
   
	$.fn.off = function(event, selector, callback) {
		return selector === undefined || $.isFunction(selector) ? _unbind(this.elems,event, selector) : _undelegate(this.elems,selector, event, callback);
	};

	$.fn.one = function(event, callback) {
		return this.each(function(i, element) {
			add(this, event, callback, null, function(fn, type) {
				return function() {
					var result = fn.apply(element, arguments);
					remove(element, type, fn);
					return result;
				}
			});
		});
	};
	
	$.fn.trigger = function(event, data, props) {
		if (typeof event == 'string')
			event = makeEvent(event, props);
		event.data = data;
		for (var i = 0,len=this.length; i <len ; i++) {
			this.elems[i].dispatchEvent(event)
		}
		return this;
	};
	
	var eventtrigger=["click","keydown","keyup","keypress","submit","load","resize","change","select","error"];
	for(var i=0,len=eventtrigger.length;i<len;i++)
		(function(i){
			$.fn[eventtrigger[i]]=function(cb){
				return cb?_bind(this.elems,eventtrigger[i],cb):this.trigger(eventtrigger[i]);
			}
		})(i);
		
		
	return $;
});