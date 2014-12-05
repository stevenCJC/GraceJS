define(['g','oop/class','./common/cache'], function (g,class,cache) {
	
	//即时插入文档或碎片
	g.UI.extend=function(name, obj){
		
		if(typeof obj=='object'){
		
			var opts=obj.options;
			delete obj.options;
			
			//一个元素对应 一个组件实例？ 多个组件
			g.ui.fn[name]=function(action,options){
				if(action&&action.constructor==Object){
					opts = g.o.extend(opts||{},action);
						this.each(function(){
							var c = new C(el,g.o.clone(opts));
							cache.addWidget(el,c);
						});
					
				}else if(action&&action.constructor==String){
					var w;
					this.each(function(){
						w=cache.getWidget(el,name);
						if(w&&w[action]) w[action](options);
						else throw 'no such widget :'+name+'. or method :'+action;
					});
				}
				
			};
			
			var C= class(function (el,options){
				this.el=g.q(el);
				this.options=options;
			},obj);
			C.prototype.__name__=name;
	
		}else if(g.is.Function(obj)) g.ui.fn[name]=obj;
		
	}
	
	
	
});
