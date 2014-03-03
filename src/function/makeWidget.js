define(['../core','../compose'], function(G,Compose) {
	//新组装一个插件
	function makeWidget(path,cons,behavior,proto){
		
		var root=this;
		
		function Widget(){
			
			cons.apply(this,arguments);
			//初始化处理阶段
			for(var x in behavior) if(x!='init'){//循环各种行为的处理
				var f=G.extend[proto.TYPE+'/behavior'][x]
				if(f){
					f=f[0];//返回初始化执行函数
					if(f)f.call(this,path,behavior[x],root);
				}
			}
			//执行初始化
			var init=behavior.init;
			if(proto.TYPE=='page') G.extend[proto.TYPE+'/behavior']['init'][0].call(this,path,behavior['init'],root);
		}
		
		proto.PATH=path;
		var extend=this.extend[proto.TYPE];//需要跟page分开扩展
		//对widget 和page的内部方法扩展
		for(var x in extend) proto[x]=extend[x];
		//原型处理阶段，所有原型方法就绪
		for(var x in behavior) {
			var f=G.extend[proto.TYPE+'/behavior'][x];
			if(f){
				f=f[1];//返回初始化前执行函数 ，应该调整一下
				if(f)f.call(this,path,behavior[x],proto);
			}
		}
		//返回组装类
		return Compose(Widget,proto);
			
	}
	
	return makeWidget;
});