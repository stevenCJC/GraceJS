define(['oop/package/var/requiredPackages','oop/package/var/loadPackageInit','oop/package/function/addLoadQueue','oop/package/var/__require','oop/package/var/loadQueue','oop/package/function/makeLoad'],function(requiredPackages,loadPackageInit,addLoadQueue,__require,loadQueue,makeLoad){

	
	
	//改变requirejs的行为
	require=function(deps,cb){
		__require(deps,function(){//一个包加载完执行callback
			cb.apply(window,arguments);//执行require callback
			
			if(!loadQueue||!loadQueue[0]) return;
			var ue=loadQueue[0];//已加载的包
			var name=ue.name[ue.loadedLength];
			var package=requiredPackages[name];
			
			if(package.deps&&package.deps.length){
				addLoadQueue(package.deps,function(){},package);//把依赖包加入到加载序列
			}/*else{
				package.init();
			}*/
			//package.init();//此时ue.loadedLength指向刚刚完成加载的包
			loadPackageInit.push(package.init);
			ue.loadedLength++;
			if(ue.loadedLength==ue.length){
				var loaded=loadQueue.shift(),init;
				if(!loadQueue.length){
					while(init=loadPackageInit.pop())init();
					//ue.callback();//一组包加载完后执行
				}
			}
			makeLoad();
			
			
		});
	}
		
	

});
