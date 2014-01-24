/*


	$			定义
	util		定义
	widget		定义
	page		定义
	page init	执行


*/

	function Grace(){
		this.widget={};
		this.extend={};
		this.DS=new DataSet();
		this.MD=new Mediator();
	}
	
	Grace.prototype={
		
		Extend:function(target,ex){
			if(!target||!(target=target.replace(/\s/ig,'')))return;
			if(target.indexOf(',')>-1)
				var targets=target.split(',');
			else var targets=[target];
			
			while(target=targets.pop()){
				if(target.toLowerCase()=='grace'){//当前对象同步加入prototype链
					for(var x in ex)Grace.prototype[x]=ex[x];
				}else{//针对一些异步生成对象的类应先保存
					var extend=this.extend[target]||(this.extend[target]={});
					for(var x in ex){
						extend[x]=ex[x];
					}
				
				}
			}
			
		},
		
	}
	
	var G=window.G=new Grace();
	
	
	
	


