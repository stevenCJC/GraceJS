define(['oop/package/var/loadPackageInit','oop/package/var/loadQueue','./makeLoad','oop/package/class/function/scope','BL/Blink/main'],function(loadPackageInit,loadQueue,makeLoad,scope,$){
	
	
	
	function addLoadQueue(name,onAllLoad,package){//与当前包无关
		if(name.constructor==String) name=[name];
		if(!loadQueue.length) 
			loadPackageInit.push(init);
		loadQueue.push({
			name:name,
			length:name.length,
			loadedLength:0,
			callback:init
		});
		
		if(name==loadQueue[0].name) makeLoad();
		function init(){
			//for(var i=0,len=name.length;i<len;i++) packages[name[i]].init();
			if(package) {
				onAllLoad(scope(name,package),$);
			}else {
				onAllLoad(scope(name),$);
			}
		};
	};
	

	return addLoadQueue;

});
