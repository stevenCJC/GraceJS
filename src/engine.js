define(["./core",'engine/Engine'], function(G,Engine) {

//不依赖任何dom操作框架
G.Extend('grace',{
	//扩展grace的Engine扩展功能
	//两个必须参数	
	// proto	原型扩展
	// extend	属性方法扩展
	Engine:function(proto,extend){
		if(proto)for(var x in proto) G.Engine.prototype[x]=proto[x];
		if(extend)for(var x in extend) $[x]=extend[x];
	},
	$:function(s){return new Engine(s);},
	
})

G.Engine({
	//引擎内部初始化
	z_freshCore:function(){
		var i=0;
		var core=this.core;
		//实现数组方式使用内部元素
		while(core[i]){this[i]=core[i];i++;}
		//返回内部元素个数
		this.length=core.length;
	},
})

});













