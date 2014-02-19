define(["./core"], function(G) {
	
	G.Extend('grace',{
		
		Page:function(path,cons,behavior,proto){
			
			proto.TYPE='page';
			//调用makeWidget函数生成page插件
			this.page[path]=makeWidget.call(this,path,cons,behavior,proto);
			//if(path.indexOf('/')==-1) 
			//	new p('DDDD');
		},
		
		
		
	});
	//提供内部page插件初始化扩展
	//专门提供page插件内部使用，
	//限制只能调用同根的page插件
	G.Extend('page',{
		//path	调用插件的路径
		//p		传入参数
		init:function(path,p){
			var w=this.page[path];
			if(this.TYPE=='page'&&w&&this.PATH.split('/')[0]==path.split('/')[0])
				return new w(p);
		},
		
	})
});