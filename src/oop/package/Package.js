define(['./var/requiredPackages','./var/__require','./var/loadQueue','./function/makeLoad','./class/function/Class','BL/Blink/main','./function/require'],function(requiredPackages,__require,loadQueue,makeLoad,Class,$){
	
	// 常规方法，不用 new
	function Package(deps,callback){
		callback(Class,$);
	}
	
	Package.load=function(name,callback){
		if(name.constructor==String) name=[name];
		loadQueue.push({name:name,length:name.length,loadedLength:0,callback:callback});
		if(name==loadQueue[0].name) makeLoad();
	};
	
	Package.clean=function(name,callback){
		
	}
	
	Package.Main=function(packageName,init){
		Class.PACKAGE=packageName;
	}
	
	
	
	
	
	return Package;

});
