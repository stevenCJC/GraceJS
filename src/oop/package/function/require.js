define(['oop/package/var/packages','oop/package/var/runtimeInit','oop/package/var/buildtimeInit','oop/package/function/addLoadQueue','oop/package/var/__require','oop/package/var/loadQueue','oop/package/function/loadNextPackage'],function(packages,runtimeInit,buildtimeInit,addLoadQueue,__require,loadQueue,loadNextPackage){

	
	
	//改变requirejs的行为
	require=function(deps,cb){
		__require(deps,function(){//一个包加载完执行callback
			cb.apply(window,arguments);//执行require callback
			
			if(!loadQueue||!loadQueue[0]) return;
			//正在加载的一组包
			var pkgGroup=loadQueue[0];
			//获得当前刚刚加载完的包名
			var name=pkgGroup.name[pkgGroup.loadedLength];
			//获得当前刚刚加载完的包
			var package=packages[name];
			//获得当前包的依赖包组，添加到待加载组队列
			if(package.deps&&package.deps.length){
				addLoadQueue(package.deps,function(){},package);//把依赖包加入到加载序列
			}
			
			/*pkgGroup.loadedLength++;
			//如果当前包为包组的最后一个包，则进行各个包的初始化
			if(pkgGroup.loadedLength==pkgGroup.length){
				//从加载组队列中删除当前加载组
				var loaded=loadQueue.shift(),init;
				//如果加载队列为空
				if(!loadQueue.length){
					while(init=buildtimeInit.pop())init();
					while(init=runtimeInit.pop())init();
				}
			}*/
			
			loadNextPackage();
			
			
		});
	}
		
	

});
