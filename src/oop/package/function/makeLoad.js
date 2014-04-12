define(['oop/package/var/packages','oop/package/var/loadPackageInit','oop/package/var/__require','oop/package/var/loadQueue',],function(packages,loadPackageInit,__require,loadQueue){

	//加载新的包
	function makeLoad(){
		var re=loadQueue[0];
		if(loadQueue.length) {
			var n=re.name[re.loadedLength];
			if(packages[n]){//判断准备加载的包是否已经加载，已加载的不用初始化
				re.loadedLength++;
				if(re.loadedLength==re.length){
					//re.callback();//一组包加载完后执行callback
					var loaded=loadQueue.shift(),init;
					if(!loadQueue.length){
						while(init=loadPackageInit.pop())init();
						//re.callback();//一组包加载完后执行
					}
					makeLoad()
				}
			}else _load(n);
		}
	}
	
	function _load(name){
		__require([name],function(){});
	}
	
	
	return makeLoad;


});
