define(['./var/packages','./var/currentPackage','./var/loadPackageInit','./function/Package','./var/loadQueue','./function/makeLoad','./function/addLoadQueue','./class/function/Class','./class/function/scope','dataset/dataset','mediator/mediator','BL/Blink/main','./function/require'],function(packages,currentPackage,loadPackageInit,Package,loadQueue,makeLoad,addLoadQueue,Class,scope,Dataset,Mediator,$){
	
	
	
	
	
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
		//currentPackage.name=packageName;
		Package.CURRENT=packageName;
		
		var packageContext=packages[packageName]={};
		Class.PACKAGE=packageName;
		packageContext.deps=deps;
		packageContext.name=packageName;
		packageContext.classes={};
		packageContext.scope={};
		packageContext.inited=false;
		packageContext.Class=function(){
			Class.apply(packageContext,arguments);
		};
		
		packageContext.$=function(a,b){
			return $(a,b);
		};
		for(var x in $)packageContext.$[x]=$[x];
		packageContext.$.publish=function(){
			
		};
		
		packageContext.dataset=new Dataset();
		packageContext.mediator=new Mediator();
		
		packageContext.init=function(){
			init(scope(packageContext.deps,packageContext),packageContext.$);
			packageContext.inited=true;
		};
		
		//不支持单个类的加载
		packageContext.Class.Load=function(name,onAllLoad){
			setTimeout(function(){
				addLoadQueue(name,onAllLoad,packageContext);
			},1);
		}
		
	}
	
	
	
	
	
	return Package;

});
