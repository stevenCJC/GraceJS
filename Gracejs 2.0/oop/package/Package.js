define(['./var/packages','./var/currentPackage','model/Models','oop/package/var/statusInfo','./var/runtimeInit','./var/buildtimeInit','./function/Package','./var/loadQueue','./function/loadNextPackage','./function/addLoadQueue','./class/function/Class','./class/function/scope','dataset/dataset','mediator/mediator','BL/main','./function/require'],function(packages,currentPackage,Models,statusInfo,runtimeInit,buildtimeInit,Package,loadQueue,loadNextPackage,addLoadQueue,Class,scope,Dataset,Mediator,$){
	
	
	
	
	
	Package.View=function(deps,callback){
		if(arguments.length==1) {
			callback=arguments[0];
			deps=[];
		}
		//从已初始化的包中获得
		var package=packages[Package.CURRENT];
		//添加依赖
		for(var i=0,len=deps.length;i<len;i++) 
			if(package.deps.indexOf(deps[i])==-1) package.deps.push(deps[i]);
		callback(package.Class.View,package.$);
		
	}
	
	Package.Controller=function(deps,callback){
		if(arguments.length==1) {
			callback=arguments[0];
			deps=[];
		}
		//从已初始化的包中获得
		var package=packages[Package.CURRENT];
		//添加依赖
		for(var i=0,len=deps.length;i<len;i++) 
			if(package.deps.indexOf(deps[i])==-1) package.deps.push(deps[i]); 
		callback(package.Class,package._); 
	}
	
	Package.Model=function(name,callback){
		var package=packages[Package.CURRENT];
		callback(package.Class.Model);
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
		///packageContext.partial={};
		
		///packageContext.inited=false;
		
		packageContext.mediator=new Mediator();
		packageContext.models=new Models();
		packageContext.views={};
		packageContext.TYPE='class';
		
		packageContext.text=function(){};
		
		//类构造器
		
		packageContext.Class=function(){
			Class.apply(packageContext,arguments);
		};
		
		///packageContext.Class.PKG={};
		
		
		/*packageContext.Class.View=function(){
			Class.apply(packageContext.viewContext,arguments);
		};*/
		//为了构造view类型的class而配备的上下文
		packageContext.viewContext={
			name:packageContext.name,
			classes:packageContext.views,
			Class:packageContext.Class.View,
			partial:{},
			VIEW:true,
			TYPE:'view',
		};
		///packageContext.Class.View.PKG={};
		/// Controller
		/*packageContext.Class.Model=function(name,options){
			if(!options) throw new Error('lack of parametter');
			packageContext.models(name,options);
		}*/
		//业务逻辑工具库
		packageContext.$=function packageContext$(a,b){
			return $(a,b);
		};
		packageContext._={};
		for(var x in $) {
			packageContext.$[x]=$[x];
			packageContext._[x]=$[x];
		}
		
		
		
		//包构建后期对类运行环境的构建
		buildtimeInit.push(function(){
			
			//开始构建类运行环境
			packageContext._.publish=function(channel,message){
				//包内
				packageContext.mediator.publish(channel,message)
				//包外
			};
			
			packageContext._.subscribe=function(){
				
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
			init(packageContext.Class,packageContext.$);
			packageContext.inited=true;
		});
		
		
		
	}
	
	
	
	
	
	return Package;

});
