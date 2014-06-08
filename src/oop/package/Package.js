define(['./var/packages','./var/currentPackage','model/Models','oop/package/var/statusInfo','./var/runtimeInit','./var/buildtimeInit','./function/Package','./var/loadQueue','./function/loadNextPackage','./function/addLoadQueue','./class/function/Class','./class/function/scope','dataset/dataset','mediator/mediator','BL/Blink/main','./function/require'],function(packages,currentPackage,Models,statusInfo,runtimeInit,buildtimeInit,Package,loadQueue,loadNextPackage,addLoadQueue,Class,scope,Dataset,Mediator,$){
	
	
	
	
	
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
		
		//class构造环境
		packageContext.classes={};
		packageContext.scope={};
		packageContext.partial={};
		
		packageContext.inited=false;
		
		packageContext.mediator=new Mediator();
		packageContext.models=new Models();
		packageContext.views={};
		packageContext.TYPE='class';
		
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
		
		packageContext.Class.PKG={};
		
		
		packageContext.Class.View=function(){
			var tmp,vc=packageContext.viewContext;
			//如果只有一个参数，则返回对应的类
			if(arguments.length==1&&arguments[0].constructor==String) 
				return vc.classes[arguments[0]];
			tmp=Class.apply(vc,arguments);
			return tmp;
		};
		//为了构造view类型的class而配备的上下文
		packageContext.viewContext={
			name:packageContext.name,
			classes:packageContext.views,
			Class:packageContext.Class.View,
			scope:{},
			partial:{},
			VIEW:true,
			TYPE:'view',
		};
		
		//scope.View 为了方便调用所有资源
		packageContext.scope.View=packageContext.viewContext.classes;
		packageContext.scope.Model=packageContext.models;
		
		packageContext.Class.Model=packageContext.models;
		
		//业务逻辑工具库
		packageContext.$=function(a,b){
			return $(a,b);
		};
		for(var x in $) packageContext.$[x]=$[x];
		
		
		
		
		//包构建后期对类运行环境的构建
		buildtimeInit.push(function(){
			
			//开始构建类运行环境
			packageContext.$.publish=function(channel,message){
				//包内
				packageContext.mediator.publish(channel,message)
				//包外
			};
			packageContext.$.subscribe=function(){
				
			};
			//执行scope，分部类构建和继承类构建
			scope(packageContext.deps,packageContext);
			//scope(packageContext.deps,packageContext.viewContext);
			//包加载，不支持单个类的加载
			//限制不能在loading期的时候使用Load方法
			//onAllLoad：包加载完后执行
			packageContext.Class.Load=function(name,onAllLoad){
				setTimeout(function(){
					statusInfo.pkgState='loading';
					addLoadQueue(name,onAllLoad,packageContext);
					runtimeInit.push(function(){
						scope(name,packageContext);
						//scope(name,packageContext.viewContext);
					});
				},1);
			}
			
		});
		
		
		//包加载完后的执行期初始化
		//添加包初始化到队列
		runtimeInit.push(function(){
			//init(scope(packageContext.deps,packageContext),packageContext.$);
			//创建类限制
			init(packageContext.scope,packageContext.$);
			packageContext.inited=true;
		});
		
		
		
	}
	
	
	
	
	
	return Package;

});
