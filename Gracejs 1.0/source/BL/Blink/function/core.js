define(['BL/Blink/dom/function/_selector'], function(_selector) {
	function $(s,w){
		console.log(arguments.callee.caller.name);
		return new Core(s,w);
	}
	$.fn = Core.prototype = {
		constructor: Core,
		selector: _selector,
		oldElement: undefined,
		forEach: [].forEach,
		reduce: [].reduce,
		push: [].push,
		indexOf: [].indexOf,
		concat: [].concat,
		slice: [].slice,
	};
	$.DEBUG={
		open:false,
		ajaxRedirect:function(url,data,method){},
	};
	
	function Core(toSelect, what) {
		this.length = 0;
		if (!toSelect) {
			return this;
		} else if (toSelect instanceof Core && what == undefined) {
			return toSelect;
		} else if ($.isFunction(toSelect)) {
		//////////////
			return $(document).ready(toSelect);
		} else if ($.isArray(toSelect) || toSelect.length != undefined&&!$.isString(toSelect)) { //Passing in an array or object
			for (var i = 0; i < toSelect.length; i++)
                    this[this.length++] = toSelect[i];
            return this;
		} else if ($.isObject(toSelect) && $.isObject(what)) { //var tmp=$("span");  $("p").find(tmp);
			if (toSelect.length == undefined) {
				if (toSelect.parentNode == what)
					this[this.length++] = toSelect;
			} else {
				for (var i = 0; i < toSelect.length; i++)
					if (toSelect[i].parentNode == what)
						this[this.length++] = toSelect[i];
			}
			return this;
		} else if ($.isObject(toSelect) && what == undefined) { //Single object
			if (toSelect.nodeType)
				this[this.length++] = toSelect;
			return this;
		} else if (what !== undefined) {
			if (what instanceof Core) {
				return what.find(toSelect);
			}
		
		} else {
			what = document;
		}
		
		return this.selector(toSelect, what);
		
	};
	
	return $;
});