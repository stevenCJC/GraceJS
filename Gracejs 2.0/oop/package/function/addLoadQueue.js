define(['oop/package/var/runtimeInit','oop/package/var/loadQueue','./loadNextPackage','oop/package/class/function/scope','BL/Blink/main'],function(runtimeInit,loadQueue,loadNextPackage,scope,$){
	
	
	//添加加载队列，加载所依赖的一系列包；
	function addLoadQueue(names,onAllLoad,package){//与当前包无关
		if(names.constructor==String) names=[names];
		
		////App调用初始化，作为第一个加入
		if(!package&&!loadQueue.length) {
			//加载完一个包的时候执行
			runtimeInit.push(function (){
				onAllLoad(scope(names),$);
			});
		}else if(package){
			runtimeInit.push(function (){
				scope(names,package);
				onAllLoad(package.Class,$);
			});
		}
	
		//在加载队列中push一组待加载的包
		loadQueue.push({
			name:names,
			loadedLength:0,
		});
		
		//如果队列为空，就马上启动加载
		if(names==loadQueue[0].name) loadNextPackage();
		
		
	};
	

	return addLoadQueue;

});
