define(['oop/package/var/packages'], function(packages) {
	/*
		同名类会被覆盖
	*/
	function scope(names,package){
		var scp={},name,Class;
		if(package){
			name=package.name;
			Class=package.Class;
			scp=package.scope;
			if(names.indexOf(name)==-1)names.push(name);//把本包名置后，以优先覆盖
		}
		var pkg,samename=[],pkgn={},PKG={};
		for(var i=0,len=names.length;i<len;i++){
			pkg=packages[names[i]];
			for(var x in pkg.classes) {
				if(Class){
					if(!Class[x]){
						Class[x]=pkg.classes[x];
					}else{
						//Class[pkg.name]=pkg.classes[x];
					}
				}
				if(!scp[x]){
					scp[x]=pkg.classes[x];
				}else{
					console.log('some Class named '+x+' was overrided.');
					//scp[pkg.name]=pkg.classes[x];
				}
			}
			
			PKG[names[i]]=pkg.classes;
			
		}
		scp.PKG=PKG;
		if(Class) Class.PKG=PKG;
		
		return scp;
	}
	
	return scope;
});