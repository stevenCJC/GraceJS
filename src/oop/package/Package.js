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
		packageContext.deps=deps;
		packageContext.name=packageName;
		packageContext.classes={};
		packageContext.scope={};
		packageContext.partial={};
		packageContext.inited=false;
		packageContext.handlers=[];
		packageContext.Class=function(){
			var tmp;
			if(arguments.length==1&&arguments[0].constructor==String) 
				if(arguments[0].indexOf('.')==-1)
					return packageContext.scope[arguments[0]];
				else {
					tmp=arguments[0].split('.');
					return packages[tmp[0]].classes[tmp[1]];
				}
			tmp=Class.apply(packageContext,arguments);
			
			return tmp;
		};
		
		packageContext.$=function(a,b){
			return $(a,b);
		};
		for(var x in $)packageContext.$[x]=$[x];
		
		packageContext.dataset=new Dataset();
		packageContext.mediator=new Mediator();
		packageContext.$.publish=function(){
			
		};
		
		//包加载完后的初始化	去2Q
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
