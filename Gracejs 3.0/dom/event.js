define(['dom/core','_/is','_/object','_/array'], function (g) {


  var _zid = 1, undefined,
      slice = Array.prototype.slice,
      isFunction = g.is.Function,
      isString = function(obj){ return typeof obj == 'string' },
      specialEvents={},
      focusinSupported = 'onfocusin' in window,
      focus = { focus: 'focusin', blur: 'focusout' },
      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  
  function parse(event) {
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eventCapture(handler, captureSetting) {
    return handler.del &&
      (!focusinSupported && (handler.e in focus)) ||
      !!captureSetting
  }

  function realEvent(type) {
    return hover[type] || (focusinSupported && focus[type]) || type
  }

  


  function proxy(fn, context) {
    var args = (2 in arguments) && slice.call(arguments, 2)
    if (isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn;
    } else if (isString(context)) {
      if (args) {
        args.unshift(fn[context], fn)
        return proxy.apply(null, args)
      } else {
        return proxy(fn[context], fn)
      }
    } else {
      throw new TypeError("expected function")
    }
  }

  
  

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }

  function compatible(event, source) {
    if (source || !event.isDefaultPrevented) {
      source || (source = event)

      g.o.each(eventMethods, function(name, predicate) {
        var sourceMethod = source[name]
        event[name] = function(){
          this[predicate] = returnTrue
          return sourceMethod && sourceMethod.apply(source, arguments)
        }
        event[predicate] = returnFalse
      })

      if (source.defaultPrevented !== undefined ? source.defaultPrevented :
          'returnValue' in source ? source.returnValue === false :
          source.getPreventDefault && source.getPreventDefault())
        event.isDefaultPrevented = returnTrue
    }
    return event
  }

  function createProxy(event) {
    var key, proxy = { originalEvent: event }
    for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

    return compatible(proxy, event)
  }


  
  

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  function triggerHandler(el, event, args){
    var e, result
    g.q(el).each(function(i, element){
      e = createProxy(isString(event) ? Event(event) : event)
      e._args = args
      e.target = element
      q.a.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  

  function Event(type, props) {
    if (!isString(type)) props = type, type = props.type
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true)
    return compatible(event)
  }
	
	
	
	
	
	
	function DomEvent(){
		
	}
	
	DomEvent.prototype={
		
		constructor:DomEvent,
		
		bind:function(el,event, selector, data, callback, one){
			var me=this;
		    var autoRemove, delegator, $this = g.q(el);
		    
		    
		    if (event && !isString(event)) {
		      g.o.each(event, function(type, fn){
		        me.bind(el,type, selector, data, fn, one);
		      })
		      return $this
		    }
		
		    if (!isString(selector) && !isFunction(callback) && callback !== false)
		      callback = data, data = selector, selector = undefined
		    if (callback === undefined || data === false)
		      callback = data, data = undefined
		
		    if (callback === false) callback = returnFalse
		
		    return $this.each(function(_, element){
		      if (one) autoRemove = function(e){
		        me._remove(this, e.type, callback)
		        return callback.apply(this, arguments)
		      }
		
		      if (selector) delegator = function(e){
		        var evt, match = g.q(e.target).closest(selector, element).get(0)
		        if (match && match !== this) {
		          evt = g.o.extend(createProxy(e), {currentTarget: match, liveFired: this})
		          return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
		        }
		      }
		
		      me._add(this, event, callback, data, selector, delegator || autoRemove)
		    })
		  
			
		},
		unbind:function(el, event, selector, callback){
			var me=this;
		    var $this = g.q(el);
		    if (event && !isString(event)) {
		      q.o.each(event, function(type, fn){
		        me.unbind(el,type, selector, fn)
		      })
		      return $this
		    }
		
		    if (!isString(selector) && !isFunction(callback) && callback !== false)
		      callback = selector, selector = undefined
		
		    if (callback === false) callback = returnFalse
		
		    return $this.each(function(){
		      me._remove(this, event, callback, selector)
		    })
		 },

		trigger: function(el, event, args){
		    event = (isString(event) ) ? Event(event) : compatible(event)
		    event._args = args
		    return g.q(el).each(function(){
		      // handle focus(), blur() by calling them directly
		      if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
		      // items in the collection might not be DOM elements
		      else if ('dispatchEvent' in this) this.dispatchEvent(event)
		      else triggerHandler(this,event, args)
		    })
		  },
		
		make:Event,
		
		_add:function(element, events, fn, data, selector, delegator, capture){
			var me=this;
		    var id = zid(element), set = (me[id] || (me[id] = []))
		    events.split(/\s|\,/g).forEach(function(event){
		      if (event == 'ready') return g.q(document).ready(fn);
		      var handler   = parse(event)
		      handler.fn    = fn
		      handler.sel   = selector
		      // emulate mouseenter, mouseleave
		      if (handler.e in hover) fn = function(e){
		        var related = e.relatedTarget
		        if (!related || (related !== this && !g.q.contains(this, related)))
		          return handler.fn.apply(this, arguments)
		      }
		      handler.del   = delegator
		      var callback  = delegator || fn
		      handler.proxy = function(e){
		        e = compatible(e)
		        if (e.isImmediatePropagationStopped()) return
		        e.data = data
		        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
		        if (result === false) e.preventDefault(), e.stopPropagation()
		        return result
		      }
		      handler.i = set.length
		      set.push(handler)
		      if ('addEventListener' in element)
		        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
		    })
		 },
		 
		 _remove:function(element, events, fn, selector, capture){
		 	var me=this;
		    var id = zid(element)
		    ;(events || '').split(/\s|\,/g).forEach(function(event){
		      me._findHandlers(element, event, fn, selector).forEach(function(handler){
		        delete me[id][handler.i]
		      if ('removeEventListener' in element)
		        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
		      })
		    })
		  },
		 _findHandlers:function(element, event, fn, selector) {
		 	var me=this;
		    event = parse(event)
		    if (event.ns) var matcher = matcherFor(event.ns)
		    return (me[zid(element)] || []).filter(function(handler) {
		      return handler
		        && (!event.e  || handler.e == event.e)
		        && (!event.ns || matcher.test(handler.ns))
		        && (!fn       || zid(handler.fn) === zid(fn))
		        && (!selector || handler.sel == selector)
		    })
		  },
		 
	};
	
	
	
	
	
	
	g.q._domEvent=new DomEvent();
	
	
	g.ui.extend({
		
		on:function(event, selector, data, callback){
			g.q._domEvent.bind(this,event, selector, data, callback);
			return this;
		},
		one:function(event, selector, data, callback){
			g.q._domEvent.bind(this, event, selector, data, callback,1);
			return this;
		},
		off:function(event, selector, callback){
			g.q._domEvent.unbind(this,event, selector, callback);
			return this;
		},
		trigger:function(event, args){
			g.q._domEvent.trigger(this, event, args);
			return this;
			
		}
		
	});
	
	
	
	
	
	
	
	return DomEvent;
	
	
	
	
	
	
	
	
	
	
	
	
	
});
