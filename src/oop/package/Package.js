define(['./var/requiredPackages','./var/__require','./var/loadQueue','./function/makeLoad','./class/Class','BL/Blink/main'],function(requiredPackages,__require,loadQueue,makeLoad,Class,$){

	function Package(packageName,deps,callback){
		Class.PACKAGE=packageName;
		callback(Class,$);
		
		
	}
	
	Package.load=function(name,callback){
		if(name.constructor==String)name=[name];
		loadQueue.push({name:name,length:name.length,loadedLength:0,callback:callback});
		if(name==loadQueue[0].name) makeLoad();
	};
	
	Package.clean=function(name,callback){
		
	}
	
	
	
	
	
	
	
	return Package;

});
