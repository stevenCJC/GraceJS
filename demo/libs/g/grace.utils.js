G.Utils=function(domUtils,funcUtils){
	
	//处理函数型工具扩展
	for(var x in funcUtils)
		(function(name,func){
			$.fn[name]=function(){
				var args=arguments;
				return this.each(function(){
					func.apply(this,args);
				});
			};
			Engine.prototype[name]=function(){
				var d=this.jq[name].apply(this.jq,arguments);
				if(this.jq.constructor==d.constructor) return this;
				else return d;
			}
		})(x,funcUtils[x]);
		
		
};
