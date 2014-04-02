define(['./Class','oop/package/var/packages'], function(Class,packages) {
	
	function scope(deps){
		
		for(var i=0,len=deps.length;i<len;i++){
			var pkg=packages[deps[i]],samename=[],pkgn={};
			for(var x in pkg.classes) {
				if(!Class[x]){
					Class[x]=pkg.classes[x];
					pkgn[x]=pkg.name;
				}else{
					Class[pkg.name+':'+x]=pkg.classes[x];
					samename.push(x);
				}
				
			}
			
		}
		
		var cl;
		while(cl=samename.pop()){
			
			delete Class[cl]
			Class[pkgn[cl]+':'+cl]=packages[pkgn[cl]].classes[cl];
			
		}
		
		return Class;
	}
	
	return scope;
});