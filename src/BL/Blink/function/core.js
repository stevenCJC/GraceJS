define(['BL/Blink/dom/function/_selector'], function(_selector) {
	function $(){
		if(arguments.length==1)
			return new Core(arguments[0]);
		else if(arguments.length==2)
			return new Core(arguments[0],arguments[1]);
		else if(arguments.length==3)
			return new Core(arguments[0],arguments[1],arguments[2]);
	}
	$.fn = Core.prototype = {
		constructor: Core,
		selector: _selector,
		oldElement: undefined
	};
	function Core(toSelect, what) {
		this.length = 0;
		this.elems=[];
		if (!toSelect) {
			return this;
		} else if (toSelect instanceof Core && what == undefined) {
			return toSelect;
		} else if ($.isFunction(toSelect)) {
		//////////////
			return $(document).ready(toSelect);
		} else if ($.isArray(toSelect) && toSelect.length != undefined) { //Passing in an array or object
			this.elems=this.elems.concat(toSelect);
			this.length=toSelect.length;
			return this;
		} else if ($.isObject(toSelect) && $.isObject(what)) { //var tmp=$("span");  $("p").find(tmp);
			if (toSelect.length == undefined) {
				if (toSelect.parentNode == what)
					this.elems[this.length++] = toSelect;
			} else {
				for (var i = 0; i < toSelect.length; i++)
					if (toSelect.elems[i].parentNode == what)
						this.elems[this.length++] = toSelect.elems[i];
			}
			return this;
		} else if ($.isObject(toSelect) && what == undefined) { //Single object
			this.elems[this.length++] = toSelect;
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