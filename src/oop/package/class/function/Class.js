define(['oop/package/var/packages','oop/package/class/var/_behavior','oop/package/class/behavior/event','oop/package/class/behavior/util','oop/package/class/behavior/dataset','oop/package/class/behavior/subscribe'], function(packages,_behavior) {
	
	/*
		@options 	string	Extend:pkgName.className
							Rebuild:pkgName.className
							Partial:className
					object	{Extend:Class.PKG.pkgName.className,Partial:'className'}
		
	*/
	
	function Class(options,cons,behavior,proto){
		var args=arguments;
		var c=options.constructor;
		if(c==String||(c==Object&&(c['Extend']||c['Rebuild']||c['Partial']))){
			
		}else if(c==Function){
			cons=options;
			options=null;
		}else if(c==Object&&(!c['extend']&&!c['rebuild']&&!c['partial'])){
			
		}
		
		
		
		
		
		
		//获取类名
		var name=cons.prototype.constructor.name;
		if(!name) throw new Error('the constructor should be named.');
		//设置包名
		cons.prototype.PACKAGE=Class.PACKAGE;
		//维护代码干净，添加行为属性存储行为信息
		cons.prototype.BEHAVIOR=behavior;
		//设置原型
		for(var x in proto) cons.prototype[x]=proto[x];
		
		//行为在类构建期执行的行为
		for(var x in behavior) _behavior[x].Build(behavior[x],cons);
		
		
		
		
		function Constructor(){
			//var new cons
			var me;//为了使对象实例带有构造函数的特性，不使用常规的继承实现，最多支持5个参数
			switch(arguments.length){
				case 0:
				me=new cons();
				break;case 1:
				me=new cons(arguments[0]);
				break;case 2:
				me=new cons(arguments[0],arguments[1]);
				break;case 3:
				me=new cons(arguments[0],arguments[1],arguments[2]);
				break;case 4:
				me=new cons(arguments[0],arguments[1],arguments[2],arguments[3]);
				break;case 5:
				me=new cons(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);
				break;
			}
			
			for(var x in behavior) _behavior[x].Init(behavior[x],me);
			
			return me;
			
		}
		
		
		
		
		
		
		
		
		
		this.classes[name]= Constructor;
		
		
		return Constructor;
		
	}
	
	
	
	
	return Class;
});

