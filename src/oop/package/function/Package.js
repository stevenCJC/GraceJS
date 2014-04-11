define(['oop/package/var/requiredPackages','oop/package/var/currentPackage','BL/Blink/main'],function(requiredPackages,currentPackage,$){
	
	
	function Package(deps,callback){
		var package=requiredPackages[currentPackage.name];
		for(var i=0,len=deps.length;i<len;i++) 
			if(package.deps.indexOf(deps[i])==-1) package.deps.push(deps[i]);
		callback(package.Class,$);
	}
	
	
	
	
	
	return Package;

});
