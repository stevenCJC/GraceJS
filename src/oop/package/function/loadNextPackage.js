define(['oop/package/var/packages','oop/package/var/statusInfo','oop/package/var/runtimeInit','oop/package/var/buildtimeInit','oop/package/var/__require','oop/package/var/loadQueue',],function(packages,statusInfo,runtimeInit,buildtimeInit,__require,loadQueue){

	//启动加载动作，有部分包可能已经加载过，需要过滤
	function loadNextPackage(){
		if(loadQueue.length) {
			//第一个加载组为当前加载组
			var pkgGroup=loadQueue[0];
			//获得当前包名
			var n=pkgGroup.name[pkgGroup.loadedLength];
			
			//判断准备加载的包是否已经加载
			//此处主要是对依赖包过滤已加载的包，已加载的包不用重新执行加载动作
			if(packages[n]){
				//已加载标识+1；
				pkgGroup.loadedLength++;
				//判断被过滤的包是否为加载组的最后一个包
				if(pkgGroup.loadedLength==pkgGroup.length){
					//从加载组队列中删除当前加载组
					var loaded=loadQueue.shift(),init;
					//如果加载队列为空
					if(!loadQueue.length){
						statusInfo.pkgState='building';
						while(init=buildtimeInit.pop())init();
						statusInfo.pkgState='running';
						while(init=runtimeInit.pop())init();
						statusInfo.pkgState='ready';
					}
				}
				//继续执行加载动作
				loadNextPackage()
			//当前包未加载的话，就进行加载
			}else _load(n);
		}
	}
	
	function _load(name){
		__require([name],function(){});
	}
	
	
	return loadNextPackage;


});
