define(["./mediator","./dataset"], function(Mediator,DataSet) {
	function Grace(){
		//存储widget类
		this.widget={};
		//存储不同的扩展函数
		this.page={};
		//存储不同的扩展函数
		this.extend={};
		//初始化数据岛对象
		this.DS=new DataSet();
		//初始化中介对象
		this.MD=new Mediator();
		//初始化路由对象
		new Router();
	}
	
	Grace.prototype={
		/*
			grace					Grace模块扩展
			widget					Widget原型扩展
			widget/init				Widget初始化key解析扩展
			widget/behavior		Widget定义的接口扩展
			widget/behavior/event	Widget定义的事件类型接口扩展
			page					Page原型扩展
			page/init				Page初始化key解析扩展
			page/behavior			Page定义的接口扩展
			page/behavior/event	Page定义的事件类型接口扩展
			
		*/
		Extend:function(target,ex){
			//过滤空白符
			if(!target||!(target=target.replace(/\s/ig,'')))return;
			
			var targets=target.split(',');
			
			while(target=targets.pop()){
				if(target.toLowerCase()=='grace'){
					//当最高级扩展，同步加入prototype链
					for(var x in ex)Grace.prototype[x]=ex[x];
				}else{
					//针对一些异步初始化的类应先保存
					var extend=this.extend[target]||(this.extend[target]={});
					for(var x in ex){
						extend[x]=ex[x];
					}
				}
			}
			
		},
		
	}
	
	if(!window.G)window.G=new Grace();
	var G=window.G;
	
	
	return G;
});
	


