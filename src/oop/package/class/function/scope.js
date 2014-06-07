define(['oop/package/var/packages'], function(packages) {
	/*
		同名类会被覆盖
	*/
	//创建包所包含的类集合
	//package：当前构造器
	function scope(names,package){
		var scp={View:{}},name,Class,View;
		if(package){
			name=package.name;
			Class=package.Class;
			View=package.Class.View;
			scp=package.scope;
			
			//把本包名置后，以优先覆盖
			if(names.indexOf(name)==-1)names.push(name);
		}
		var pkg,samename=[],pkgn={},PKG=Class?Class.PKG||{}:{};
		//获取每个包的classes属性
		for(var i=0,len=names.length;i<len;i++){
			pkg=packages[names[i]];
			//把每个包的自己所属的class添加到当前Class构造器
			for(var x in pkg.classes) {
				if(Class){
					if(!Class[x]){
						Class[x]=pkg.classes[x];
					}else{
						//Class[pkg.name]=pkg.classes[x];
					}
				}
				
				//构造scope，存储所有相关包域的所有类
				if(scp[x])console.log('some Class named '+x+' was overrided.');
				scp[x]=pkg.classes[x];
				
			}
			
			//存储各个包命名空间
			PKG[names[i]]=pkg.classes;
		}
		if(!package) package=packages[names[names.length-1]];
		for(var x in package.views) {
			if(View){
				if(!View[x]){
					View[x]=package.views[x];
				}
			}
			scp.View[x]=package.views[x];
		}
		
		//包含命名空间的scope
		scp.PKG=PKG;
		if(Class) {
			Class.PKG=PKG;
		}
		
		return scp;
	}
	
	return scope;
});