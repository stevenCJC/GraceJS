define(['$','./function/_bind','./function/_delegate','./function/_unbind','./function/_undelegate','./function/remove','./function/add','./function/makeEvent'], function ($,_bind,_delegate,_unbind,_undelegate,remove,add,makeEvent) {
	
	$.fn.on = function(event, selector, callback) {
		return selector === undefined || $.isFunction(selector) ? _bind(this,event, selector) : _delegate(this,selector, event, callback);
	};
   
	$.fn.off = function(event, selector, callback) {
		return selector === undefined || $.isFunction(selector) ? _unbind(this,event, selector) : _undelegate(this,selector, event, callback);
	};

	$.fn.one = function(event, callback) {
		return this.each(function(i, element) {
			var el=this;
			add(this, event, callback, null, function(fn, type) {
				return function() {
					var result = fn.apply(el, arguments);
					remove(el, type, fn);
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
			this[i].dispatchEvent(event)
		}
		return this;
	};
	
	var eventtrigger=["click","keydown","keyup","keypress","submit","load","resize","change","select","error"];
	for(var i=0,len=eventtrigger.length;i<len;i++)
		(function(i){
			$.fn[eventtrigger[i]]=function(cb){
				return cb?_bind(this,eventtrigger[i],cb):this.trigger(eventtrigger[i]);
			}
		})(i);
		
		
	return $;
});