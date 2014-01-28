/*


	$			定义
	util		定义
	widget		定义
	page		定义
	page init	执行


*/

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
		this.R=new Router();
	}
	
	Grace.prototype={
		
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
	
	var G=window.G=new Grace();
	
	
	
	


