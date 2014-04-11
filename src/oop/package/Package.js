define(['./var/requiredPackages','./var/currentPackage','./var/loadPackageInit','./function/Package','./var/loadQueue','./function/makeLoad','./function/addLoadQueue','./class/function/Class','./class/function/scope','BL/Blink/main','./function/require'],function(requiredPackages,currentPackage,loadPackageInit,Package,loadQueue,makeLoad,addLoadQueue,Class,scope,$){
	
	
	
	
	
	Package.clean=function(name,callback){
		
	}
	
	//初始化一个包
	Package.Main=function(packageName,deps,init){
		if(packageName.constructor!=String) {
			throw new Error('packageName must be String.')
		}else if(!init){
			init=deps;
			deps=[];
		}
		currentPackage.name=packageName;
		Package.CURRENTPACKAGE=packageName;
		var package=requiredPackages[packageName]={};
		Class.PACKAGE=packageName;
		package.deps=deps;
		package.name=packageName;
		package.classes={};
		package.scope={};
		package.inited=false;
		package.Class=function(){
			Class.apply(package,arguments);
		};
		package.init=function(){
			init(scope(package.deps,package),$);
			package.inited=true;
		};
		
		//不支持单个类的加载
		package.Class.Load=function(name,onAllLoad){
			setTimeout(function(){
				addLoadQueue(name,onAllLoad,package);
			},1);
		}
		
	}
	
	
	
	
	
	return Package;

});
