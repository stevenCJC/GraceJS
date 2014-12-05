define(['g','ui/function/_selector','_/is'], function(g,_selector) {
	
	g.q = function (s,w){
		return new Core(s,w);
	}
	
	g.ui={};
	g.ui.fn = Core.prototype = {
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
	
	g.ui.extend=function(obj){
		for(var x in obj) g.ui.fn[x]=obj[x];
	};
	
	g.ui.fn.each=function(cb){
		for(var i=0,l=this.length;i<l;i++)
			if(cb.call(this[i],this[i],i)===false) break;
	};
	
	g.ui.fn.map=function(cb){
		var r=[],t;
		for(var i=0,l=this.length;i<l;i++){
			t=cb.call(this[i],this[i],i);
			if(t!==undefined) r.push(t);
		}
		return r;
	};
	
	
	function Core(toSelect, what) {
		this.length = 0;
		if (!toSelect) {
			return this;
		} else if (toSelect instanceof Core && what == undefined) {
			return toSelect;
		} else if (g.is.Function(toSelect)) {
		//////////////
			return g.q(document).ready(toSelect);
		} else if (g.is.array(toSelect) || toSelect.length != undefined&&!g.is.string(toSelect)) { //Passing in an array or object
			for (var i = 0; i < toSelect.length; i++)
                    this[this.length++] = toSelect[i];
            return this;
		} else if (g.is.object(toSelect) && g.is.object(what)) { //var tmp=$("span");  $("p").find(tmp);
			if (toSelect.length == undefined) {
				if (toSelect.parentNode == what)
					this[this.length++] = toSelect;
			} else {
				for (var i = 0; i < toSelect.length; i++)
					if (toSelect[i].parentNode == what)
						this[this.length++] = toSelect[i];
			}
			return this;
		} else if (g.is.object(toSelect) && what == undefined) { //Single object
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
	return g;
});