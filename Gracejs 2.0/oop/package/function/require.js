define(['oop/package/var/packages','oop/package/var/runtimeInit','oop/package/var/buildtimeInit','oop/package/function/addLoadQueue','oop/package/var/__require','oop/package/var/loadQueue','oop/package/function/loadNextPackage'],function(packages,runtimeInit,buildtimeInit,addLoadQueue,__require,loadQueue,loadNextPackage){

	
	
	//改变requirejs的行为，变为包加载器
	require=function(deps,cb){
		__require(deps,function(){//一个包加载完执行callback，把其依赖包组加入待加载序列
		
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
			
			
			loadNextPackage();
			
			
		});
	}
		
	

});
