define(['oop/package/var/runtimeInit','oop/package/var/loadQueue','./loadNextPackage','oop/package/class/function/scope','BL/Blink/main'],function(runtimeInit,loadQueue,loadNextPackage,scope,$){
	
	
	//添加加载队列，加载所依赖的一系列包；
	function addLoadQueue(name,onAllLoad,pkgs){//与当前包无关
		if(name.constructor==String) name=[name];
		
		////App调用初始化，作为第一个加入
		if(!pkgs&&!loadQueue.length) {
			//加载完一个包的时候执行
			runtimeInit.push(function (){
				//此处不允许main初始化时构造类
				onAllLoad(scope(name),$);
			});
		}
	
		//在加载队列中push一组待加载的包
		loadQueue.push({
			name:name,
			length:name.length,
			loadedLength:0,
		});
		
		//如果队列为空，就马上启动加载
		if(name==loadQueue[0].name) loadNextPackage();
		
		
	};
	

	return addLoadQueue;

});
