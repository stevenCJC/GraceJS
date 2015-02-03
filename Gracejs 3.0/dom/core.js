define(['g','dom/function/_selector','_/is','_/object'], function(g,_selector) {
	
	g.q = function (s,w){
		return new Core(s,w);
	};
	g.q.contains = document.documentElement.contains ?
	    function(parent, node) {
	      return parent !== node && parent.contains(node)
	    } :
	    function(parent, node) {
	      while (node && (node = node.parentNode))
	        if (node === parent) return true
	      return false
	    };
	
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
	
		
	// extend(name,classFunction)	//开发插件的时候比较有用的扩展方式,直接支持对子方法的调用模式
	// extend(name,{				//基于name的命名空间下，对子方法的调用模式，使用第三方插件、定义接口的时候比较有用
	// 	main:function(){},
	//	name1:function(){},
	//	name2:function(){},
	//});
	// extend(obj)					//基本扩展方式
	g.ui.extend=function(name,obj){
		if(arguments.length==1&&name.constructor==Object)
			for(var x in name) g.ui.fn[x]=name[x];
		else if(arguments.length==2){
			if(obj.constructor==Object) {
				g.ui.fn[name]=function(action, options){
					if(action&&action.constructor==String&&obj[action]){
						
						obj[action].apply(this,arguments.slice(1));
							
					}else{
						
						obj[name].apply(this,arguments);
						
					}
				};
			}else if(obj.constructor==Function){
				g.ui.fn[name]=function(action, options){
					if(action&&action.constructor==String&&obj[action]){
						
						obj[action].apply(this,arguments.slice(1));
							
					}else{
						var wdg,p;
						this.each(function(){
							wdg=new obj(this,action);
							p=g.q(this).closest('[_]').attr('_');
							//////////////////////////////////// 插入相应组件对象的使用组件数组里面
						});
						obj[name].apply(this,arguments);
						
					}
				};
			}
		}
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