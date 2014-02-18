
	var handlers = {}, 
	_jqmid = 1;
	function jqmid(element) {
		return element._jqmid || (element._jqmid = _jqmid++);
	}

	function findHandlers(element, event, fn, selector) {
		event = parse(event);
		if (event.ns)
			var matcher = matcherFor(event.ns);
		return (handlers[jqmid(element)] || []).filter(function(handler) {
			return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || handler.fn == fn || (typeof handler.fn === 'function' && typeof fn === 'function' && "" + handler.fn === "" + fn)) && (!selector || handler.sel == selector);
		});
	}
	function parse(event) {
		var parts = ('' + event).split('.');
		return {
			e: parts[0],
			ns: parts.slice(1).sort().join(' ')
		};
	}
	function matcherFor(ns) {
		return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
	}
	function eachEvent(events, fn, iterator) {
		if ($.isObject(events))
			$.each(events, iterator);
		else
			events.split(/\s/).forEach(function(type) {
				iterator(type, fn)
			});
	}
	function add(element, events, fn, selector, getDelegate) {
		var id = jqmid(element), 
		set = (handlers[id] || (handlers[id] = []));
		eachEvent(events, fn, function(event, fn) {
			var delegate = getDelegate && getDelegate(fn, event), 
			callback = delegate || fn;
			var proxyfn = function(event) {
				var result = callback.apply(element, [event].concat(event.data));
				if (result === false)
					event.preventDefault();
				return result;
			};
			var handler = $.extend(parse(event), {
				fn: fn,
				proxy: proxyfn,
				sel: selector,
				del: delegate,
				i: set.length
			});
			set.push(handler);
			element.addEventListener(handler.e, proxyfn, false);
		});
		//element=null;
	}
	function remove(element, events, fn, selector) {
		
		var id = jqmid(element);
		eachEvent(events || '', fn, function(event, fn) {
			findHandlers(element, event, fn, selector).forEach(function(handler) {
				delete handlers[id][handler.i];
				element.removeEventListener(handler.e, handler.proxy, false);
			});
		});
	}
	
	$.event = {
		add: add,
		remove: remove
	}

	$.fn.bind = function(event, callback) {
		for (var i = 0; i < this.length; i++) {
			add(this[i], event, callback);
		}
		return this;
	};

	$.fn.unbind = function(event, callback) {
		for (var i = 0; i < this.length; i++) {
			remove(this[i], event, callback);
		}
		return this;
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

	$.fn.delegate = function(selector, event, callback) {
		for (var i = 0; i < this.length; i++) {
			var element = this[i];
			add(element, event, callback, selector, function(fn) {
				return function(e) {
					var evt, match = $(e.target).closest(selector, element).get(0);
					if (match) {
						evt = $.extend(createProxy(e), {
							currentTarget: match,
							liveFired: element
						});
						return fn.apply(match, [evt].concat([].slice.call(arguments, 1)));
					}
				}
			});
		}
		return this;
	};

	$.fn.undelegate = function(selector, event, callback) {
		for (var i = 0; i < this.length; i++) {
			remove(this[i], event, callback, selector);
		}
		return this;
	}

	$.fn.on = function(event, selector, callback) {
		return selector === undefined || $.isFunction(selector) ? this.bind(event, selector) : this.delegate(selector, event, callback);
	};

	$.fn.off = function(event, selector, callback) {
		return selector === undefined || $.isFunction(selector) ? this.unbind(event, selector) : this.undelegate(selector, event, callback);
	};

	$.fn.trigger = function(event, data, props) {
		if (typeof event == 'string')
			event = $.Event(event, props);
		event.data = data;
		for (var i = 0; i < this.length; i++) {
			this[i].dispatchEvent(event)
		}
		return this;
	};

	$.Event = function(type, props) {
		var event = document.createEvent('Events'), 
		bubbles = true;
		if (props)
			for (var name in props)
				(name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name]);
		event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null);
		return event;
	};

	$.bind = function(obj, ev, f){
		if(!obj.__events) obj.__events = {};
		if(!$.isArray(ev)) ev = [ev];
		for(var i=0; i<ev.length; i++){
			if(!obj.__events[ev[i]]) obj.__events[ev[i]] = [];
			obj.__events[ev[i]].push(f);
		}
	};

	$.trigger = function(obj, ev, args){
		var ret = true;
		if(!obj.__events) return ret;
		if(!$.isArray(ev)) ev = [ev];
		if(!$.isArray(args)) args = [];
		for(var i=0; i<ev.length; i++){
			if(obj.__events[ev[i]]){
				var evts = obj.__events[ev[i]];
				for(var j = 0; j<evts.length; j++)
					if($.isFunction(evts[j]) && evts[j].apply(obj, args)===false) 
						ret = false;
			}
		}
		return ret;
	};

	$.unbind = function(obj, ev, f){
		if(!obj.__events) return;
		if(!$.isArray(ev)) ev = [ev];
		for(var i=0; i<ev.length; i++){
			if(obj.__events[ev[i]]){
				var evts = obj.__events[ev[i]];
				for(var j = 0; j<evts.length; j++){
					if(f==undefined)
						delete evts[j];
					if(evts[j]==f) {
						evts.splice(j,1);
						break;
					}
				}
			}
		}
	};
