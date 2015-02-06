define(['g','_/is','template/tpl'], function (g) {
	
	var tpl={
		__onInstantiate:function(){
			
			var me=this;
			
			if(this.Template){
				
				for(var x in this.Template) {
					(function(x, tpl){
						me['t_'+x]=function(ok,err){
							if(g.is.Function(ok)){
								var func=ok;
								ok=function(tpl){
									return func.call(me,tpl);
								};
							}
							if(g.is.string(tpl)){
								if(!ok) 
									return g.template.load(tpl)();
								else if(!g.is.Function(ok)) return g.template.load(tpl)(ok);
								else g.template.load(tpl,ok,err);
							}else if(g.is.Function(tpl)) {
								if(!ok) return tpl();
								else if(!g.is.Function(ok)) return tpl(ok);
								else setTimeout(function(){ ok(tpl); },0);
							}							
						};
					})(x, this.Template[x]);
					
					
				}
				
			}
			
		},
		
		loadTpl:function(html,ok,err){
			
				if(!ok) 
					return g.template.load(tpl)();
				else if(!g.is.Function(ok)) return g.template.load(tpl)(ok);
				else {
					if(g.is.Function(ok)){
						var func=ok;
						ok=function(tpl){
							return func.call(me,tpl);
						};
					}
					g.template.load(tpl,ok,err);
				}
		},
		
		
	};
	
	
	
	return tpl;
});