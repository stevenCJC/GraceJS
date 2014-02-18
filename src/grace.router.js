	/*
		hash路由控制机制的实现
		每个/之间的元素都是一个动作
		会自动向中介publish一些信息
		如有冒号，冒号前面就是订阅名称，后面就是对应参数
		
		
	*/
	
	function Router(){
		this.routers={};
		//绑定hash改变事件
		window.addEventListener('hashchange',function(e){
			hashRouter(e);
		},false);
	}
	
	
	function hashRouter(e){
		//下面两个变量暂无作用
		var newURL=e.newURL;
		var oldURL=e.oldURL;
		//去除#，返回反编码后的路径
		var hash;
		if(window.location.hash)hash=decodeURI(window.location.hash).substr(1);
		if(hash) var hashs=hash.split('/');//如果有hash则以/分拆路径
		else return;//如果没有hash则停止执行
		var subs,index,subs,param,h;
		while(h=hashs.pop()){
			if(h.indexOf(':')>-1) {
				//分拆订阅名称和参数
				index=h.indexOf(':');
				subs=h.substr(0,index);
				param=h.substr(index+1);
			}else{
				subs=h;
			}
			
			
			//这里需要扩展param的解析函数
			G.MD.publish(subs,param);
			
			
		}
		
	}
	
	
	
	
	