define(['../core','../compose','oop/baseClass'], function(G,Compose,baseClass) {
	//新组装一个插件
	function makeWidget(path,func,behavior,proto){
		
		var root=this;
		
		function Widget(p){
			
			if(this.INHERIT){
				var base=this.base=new G.widget[this.INHERIT](p);
				for(var x in base)if(base.hasOwnProperty(x))this[x]=base[x];
			}
			
			func.call(this,p);
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
		
		Widget.prototype.PATH=path;
		
		if(baseClass.path){
			Widget.prototype[baseClass.type]=baseClass.path;
			if(baseClass.type=='REBUILT') Widget.prototype.baseProto=G.chips[baseClass.path].proto;
			baseClass.path=null;
		}
		
		var extend=this.extend[proto.TYPE];//需要跟page分开扩展
		//对widget 和page的内部方法扩展
		for(var x in extend) Widget.prototype[x]=extend[x];
		//原型处理阶段，所有原型方法就绪
		for(var x in behavior) {
			var f=G.extend[proto.TYPE+'/behavior'][x];
			if(f){
				f=f[1];//返回初始化前执行函数 ，应该调整一下
				if(f)f.call(this,path,behavior[x],proto);
			}
		}
		
		for(var x in proto)Widget.prototype[x]=proto[x];
		//返回组装类
		return Widget;
			
	}
	
	return makeWidget;
});