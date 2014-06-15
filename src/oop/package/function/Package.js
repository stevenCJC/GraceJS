define(['oop/package/var/packages','BL/Blink/main'],function(packages,currentPackage,$){
	
	//包构造器
	function Package(deps,callback){
		if(arguments.length==1) {
			callback=arguments[0];
			deps=[];
		}
		//从已初始化的包中获得
		var package=packages[Package.CURRENT];
		//添加依赖
		for(var i=0,len=deps.length;i<len;i++) 
			if(package.deps.indexOf(deps[i])==-1) package.deps.push(deps[i]);
		//构造期执行当前文件构造当前包
		callback(package.Class,package.$,package.Text);
	}
	
	
	
	
	
	return Package;

});
