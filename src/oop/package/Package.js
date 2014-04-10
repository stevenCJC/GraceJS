define(['./var/requiredPackages','./var/__require','./var/loadQueue','./function/makeLoad','./class/function/Class','./class/function/scope','./var/currentPackage','BL/Blink/main','./function/require'],function(requiredPackages,__require,loadQueue,makeLoad,Class,scope,currentPackage,$){
	
	// 常规方法，不用 new
	function Package(deps,callback){
		for(var i=0,len=deps;i<len;i++) 
			if(currentPackage.deps.indexOf(deps[i])==-1) currentPackage.deps.push(deps[i]);
		callback(Class,$);
	}
	
	Package.load=function(name,onAllLoad){
		if(name.constructor==String) name=[name];
		loadQueue.push({
			name:name,
			length:name.length,
			loadedLength:0,
			callback:function(){
				requiredPackages[currentPackage.name]=currentPackage;
				scope(Class);
				currentPackage.init();//当前包初始化执行
				onAllLoad(Class,$);
				
			}
		});
		if(name==loadQueue[0].name) makeLoad();
	};
	
	
	Package.clean=function(name,callback){
		
	}
	
	Package.Main=function(packageName,init){
		//currentPackage={};
		Class.PACKAGE=packageName;
		currentPackage.deps=[];
		currentPackage.name=packageName;
		currentPackage.classes={};
		currentPackage.scope={};
		currentPackage.init=function(){
			init(currentPackage.scope,$);
		};
	}
	
	
	
	
	
	return Package;

});
