define(['oop/package/var/requiredPackages','oop/package/var/currentPackage'], function(requiredPackages,currentPackage) {
	
	function scope(Class){
		var deps=currentPackage.deps.concat([currentPackage.name]);
		var scp=currentPackage.scope;
		var pkg,samename=[],pkgn={};
		for(var i=0,len=deps.length;i<len;i++){
			pkg=requiredPackages[deps[i]];
			for(var x in pkg.classes) {
				if(!Class[x]){
					Class[x]=pkg.classes[x];
					if(pkg.name!=currentPackage.name) pkgn[x]=pkg.name;
				}else{
					if(pkg.name!=currentPackage.name) Class[pkg.name+'.'+x]=pkg.classes[x];
					else Class[x]=pkg.classes[x];
					samename.push(x);
				}
				if(!scp[x]){
					scp[x]=pkg.classes[x];
				}else{
					if(pkg.name!=currentPackage.name) scp[pkg.name+'.'+x]=pkg.classes[x];
					else scp[x]=pkg.classes[x];
					samename.push(x);
				}
			}
		}
		
		var cl;
		while(cl=samename.pop()){
			
			delete Class[cl];
			delete scp[cl]
			Class[pkgn[cl]+'.'+cl]=requiredPackages[pkgn[cl]].classes[cl];
			scp[pkgn[cl]+'.'+cl]=requiredPackages[pkgn[cl]].classes[cl];
			
		}
		
		return Class;
	}
	
	return scope;
});