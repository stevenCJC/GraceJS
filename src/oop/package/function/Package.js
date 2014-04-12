define(['oop/package/var/packages','BL/Blink/main'],function(packages,currentPackage,$){
	
	
	function Package(deps,callback){
		var package=packages[Package.CURRENT];
		for(var i=0,len=deps.length;i<len;i++) 
			if(package.deps.indexOf(deps[i])==-1) package.deps.push(deps[i]);
		callback(package.Class,package.$);
	}
	
	
	
	
	
	return Package;

});
