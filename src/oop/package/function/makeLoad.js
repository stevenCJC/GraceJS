define(['oop/package/var/requiredPackages','package/var/__require','package/var/loadQueue',],function(requiredPackages,__require,loadQueue){


	function makeLoad(){
		var re=loadQueue[0];
		if(loadQueue.length) {
			var n=re.name[re.loadedLength];
			if(requiredPackages.indexOf(n)>-1){
				re.loadedLength++;
				if(re.loadedLength==re.length){
					loadQueue.shift();
					re.callback();
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
