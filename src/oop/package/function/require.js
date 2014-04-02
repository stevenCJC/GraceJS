define(['oop/package/var/requiredPackages','oop/package/var/__require','oop/package/var/loadQueue','oop/package/function/makeLoad'],function(requiredPackages,__require,loadQueue,makeLoad){

	
	
	//改变requirejs的行为
	require=function(deps,cb){
		__require(deps,function(){
			cb.apply(window,arguments);
			
			if(!loadQueue||!loadQueue[0])return;
			var ue=loadQueue[0];
			ue.loadedLength++;
			requiredPackages.push(ue.name[ue.loadedLength-1]);
			if(ue.loadedLength==ue.length){
				loadQueue.shift();
				ue.callback();
			}
			makeLoad();
		});
	}
		
	

});
