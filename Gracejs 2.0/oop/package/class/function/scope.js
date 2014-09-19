define(['oop/package/var/packages'], function(packages) {
	/*
		同名类会被覆盖
	*/
	//创建包所包含的类集合
	//package：当前构造器
	function scope(names,package){
		var name,Class={View:{PKG:{}},PKG:{}},View=Class.View;
		if(package){
			name=package.name;
			Class=package.Class;
			View=package.Class.View;
			//scp=package.scope;
			
			//把本包名置后，以优先覆盖
			//if(names.indexOf(name)==-1)names.push(name);
		}
		var pkg;
		//获取每个包的classes属性
		for(var i=0,len=names.length;i<len;i++){
			pkg=packages[names[i]];
			Class.PKG[names[i]]=pkg.classes;
			View.PKG[names[i]]=pkg.views;
		}
		if(package){
			for(var x in package.classes) {
				if(!Class[x]){
					Class[x]=package.classes[x];
				}
			}
			for(var x in package.views) {
				if(!View[x]){
					View[x]=package.views[x];
				}
			}
		}
		
		return Class;
	}
	
	return scope;
});