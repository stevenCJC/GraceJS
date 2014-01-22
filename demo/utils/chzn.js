G.Utils=function(u,f){
	for(var x in f)
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
		})(x,f[x]);
};


G.Utils({
	
	//使用data-util进行初始化
	'util:chzn':function(el,p){},
	'util:chzn-multi':function(el,p){},
	
},{
	
	//为初始化后的组件提供操作方法
	chznSet:function(value){
		//这里使用底层库实现代码
		if(!this.inited){
			//$(this).chosen();
			this.inited=true;
		}
		console.log(value);
		$(this).val(value).change()//.trigger('list:update');
	},
	
	chznUpdate:function(value){
		//这里使用底层库实现代码
		//$(this).val(value).change().trigger('list:update');
	},
	
	
	
})





