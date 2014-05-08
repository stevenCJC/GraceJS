define(['./var/packages','./var/currentPackage','oop/package/var/statusInfo','./var/runtimeInit','./var/buildtimeInit','./function/Package','./var/loadQueue','./function/loadNextPackage','./function/addLoadQueue','./class/function/Class','./class/function/scope','dataset/dataset','mediator/mediator','BL/Blink/main','./function/require'],function(packages,currentPackage,statusInfo,runtimeInit,buildtimeInit,Package,loadQueue,loadNextPackage,addLoadQueue,Class,scope,Dataset,Mediator,$){
	
	
	
	
	
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
		//类构造器
		packageContext.Class=function(){
			var tmp;
			//如果只有一个参数，则返回对应的类
			if(arguments.length==1&&arguments[0].constructor==String) 
				if(arguments[0].indexOf('.')==-1)
					return packageContext.scope[arguments[0]];
				else {
					tmp=arguments[0].split('.');
					return packageContext.scope.PKG[tmp[0]][tmp[1]];
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
		
		
		
		//包构建后期执行包的构建
		buildtimeInit.push(function(){
			
			//执行scope，分部类构建和继承类构建
			scope(packageContext.deps,packageContext);
			
			//包加载，不支持单个类的加载
			//限制不能在loading期的时候使用Load方法
			//onAllLoad：包加载完后执行
			
			packageContext.Class.Load=function(name,onAllLoad){
				setTimeout(function(){
					statusInfo.pkgState='loading';
					addLoadQueue(name,onAllLoad,packageContext);
					runtimeInit.push(function(){
						scope(name,packageContext);
					});
				},1);
			}
			
		});
		
		
		//包加载完后的执行期初始化
		//添加包初始化到队列
		runtimeInit.push(function(){
			//init(scope(packageContext.deps,packageContext),packageContext.$);
			init(packageContext.scope,packageContext.$);
			packageContext.inited=true;
		});
		
		
		
	}
	
	
	
	
	
	return Package;

});
