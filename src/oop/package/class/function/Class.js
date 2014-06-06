define(['oop/package/var/buildtimeInit','oop/package/var/statusInfo','oop/package/class/function/View','oop/package/class/var/_behavior','BL/Blink/main','oop/package/class/behavior/event','oop/package/class/behavior/util','oop/package/class/behavior/dataset','oop/package/class/behavior/subscribe','oop/package/class/behavior/state','oop/package/class/behavior/tpl'], function(buildtimeInit,statusInfo,View,_behavior,$) {
	
	/*
		@options 	string	Extend:pkgName.className
							Rebuild:pkgName.className
							Partial:className
					object	{Extend:Class.PKG.pkgName.className,Partial:'className'}
		
	*/
	
	//类构造器
	function Class(){
		
		var options,name,cons,behavior,proto,that=this;
		
		var args=arguments,tmp,keys,extend,arg,c;
		
		var __behavior=_behavior[this.TYPE];
		//判别传入构件
		argsLoop:{
			for(var i=0,len=args.length;i<len;i++){
				
				arg=args[i];
				if(typeof arg =='undefined') continue;
				c=arg.constructor;
				tmp=null;
				
				if(c==String){//判定
					if(arg.indexOf(':')==-1) {
						name=arg;
						continue;
					}
					tmp=arg.split(':');
					if(!options)options={};
					if(tmp[1].indexOf('.')==-1) {
						//继承
						if(tmp[0]!='Partial') options[tmp[0]]=this.classes[tmp[1]]||this.scope[tmp[1]];
						else {
							//分部类
							options[tmp[0]]=tmp[1]; 
						}
					}else {
						var t=tmp[1].split('.');
						options[tmp[0]]=this.Class.PKG[t[0]][t[1]];
					}
				}else if(c==Function){//判定
					cons=arg;
				}else if(c==Object){
					//可能性一
					if(!options){
						extend='Extend';
						if(!arg[extend]) extend='Rebuild';
						else  options=arg;
						if(!arg[extend]) extend=null;
						else options=arg;
						if(extend){
							if(arg[extend].constructor==String&&statusInfo.pkgState=='building'){
								if(arg[extend].indexOf('.')==-1) options[extend]=this.classes[arg[extend]]||this.scope[arg[extend]];
								else {
									tmp=arg[extend].split('.');
									options[extend]=this.Class.PKG[tmp[0]][tmp[1]];
								}
							}
						}
						else if(arg['Partial']||arg['Name']){
							options=arg;
						}
					}
					//可能性二
					if(!proto){
						keys=Object.keys(arg);
						keysLoop:{
							//检测是否为行为对象
							for(var j=0,l=keys.length;j<l;j++){
								if(keys[j] in __behavior) {
									behavior=arg;
									break keysLoop;
								}
							}
							if(options!=arg)proto=arg;
						}
					}
				}
			}
		}
		
		if(!name&&cons) name=cons.prototype.constructor.name;
		
		if(!cons&&behavior||options&&options[extend]&&options[extend].constructor==Function&&!cons) {
			cons=function(){};
			cons.EMPTY=true;
		}
		
		if(!name&&options) name=options['Name']=options['Partial']||options['Name'];
		if(name) {
			options=options||{};
			options.Name=name;
		}
		//Partial处理
		if(options&&options['Partial']){
			//如果已经挂载分部函数，删除Partial标识以避免重复挂载
			if(this.partial[name]) delete options['Partial'];
			var part=this.partial[name]=this.partial[name]||{};
			part.options=$.extend(part.options||{},options);
			if(cons&&(part.cons&&part.cons.EMPTY===true||!part.cons)) part.cons=cons;
			if(behavior) {
				for(var x in behavior) {
					if(!part.behavior) part.behavior={};
					part.behavior[x]=$.extend(part.behavior[x]||{},behavior[x]);
				}
			}
			if(proto) part.proto=$.extend(part.proto||{},proto);
			
			//如果当前不是构建期，则推到构建期再构建
			if(statusInfo.pkgState!='building'){
				var that=this;
				if(part.options['Partial']){
					delete part.options['Partial'];
					buildtimeInit.push(function(){
						Class.call(that,part.options,part.cons,part.behavior,part.proto);
					});
				}
				return;
			}else{
				delete part.options['Partial'];
				//return Class.call(that,part.options,part.cons,part.behavior,part.proto);
			}
		}
		
		//继承处理
		if(extend&&statusInfo.pkgState=='building'){
			var _cons,_behav,beh;
			//如果被继承的是原型类
			if(options[extend].constructor==Function){
				_cons=options[extend].prototype.constructor;
				if(!cons)cons=function(){};
				_behav=options[extend].prototype.BEHAVIOR;
				if(_behav){
					if(options.Behavior) {
						beh=options.Behavior;
						if(beh.constructor==String) beh=beh.replace(/\s/g,'').split(/[\,]/g);
					}else beh=Object.keys(__behavior);
					
					//根据继承行为种类进行拷贝构件
					tmp={};//二层克隆
					if(behavior){
						for(var i=0,len=beh.length;i<len;i++){
							if((_behav[beh[i]]||behavior[beh[i]])&&(!_behav[beh[i]]||!behavior[beh[i]])) tmp[beh[i]]=_behav[beh[i]]||behavior[beh[i]];
							else if(_behav[beh[i]]&&behavior[beh[i]]) tmp[beh[i]]=$.extend({},_behav[beh[i]]||{},behavior[beh[i]]||{});
							if(tmp[beh[i]]&&!Object.keys(tmp[beh[i]]).length) delete tmp[beh[i]];
						}
					}else behavior=_behav||{};
					behavior=$.extend({},behavior||{},tmp);
					if(!Object.keys(behavior).length) behavior=null;
					
				}
				proto=$.extend({},options[extend].prototype||{},proto||{});
				if(!Object.keys(proto).length) proto=null;
				
			}else{//如果是静态类
				proto=$.extend({},options[extend]||{},proto||{});
				if(!Object.keys(proto).length) proto=null;
			}
		}else if(extend){
			var that=this;
			//如果当前不是构建期，则推到构建期再构建
			buildtimeInit.push(function(){
				if(!that.classes[name])Class.call(that,options,cons,behavior,proto);
			});
			return;
		}
		
		//构造器处理
		if(cons){
			if(proto) for(var x in proto) Constructor.prototype[x]=proto[x];
			
			if(_cons) Constructor.prototype.BASECLASS=(_cons.prototype.PACKAGE||'unknown')+'.'+(_cons.prototype.NAME||'unknown');
			
			if(extend)Constructor.prototype.Base=options[extend].prototype;
			
			if(behavior) {
				//维护代码干净，添加行为属性存储行为信息
				Constructor.prototype.BEHAVIOR=behavior;
				//行为在类构建期执行的行
				for(var x in behavior) __behavior[x].Build(behavior[x],Constructor);
			}else delete Constructor.prototype.BEHAVIOR;
			
			if(name) Constructor.prototype.NAME=name;
			else delete Constructor.prototype.NAME;
			
			Constructor.prototype.PACKAGE=this.name;
			Constructor.prototype.CONSTRUCTOR=cons;
			Constructor.prototype.constructor=Constructor;
			
			if(name){
				this.classes[name]= Constructor;
			}
			//限制不能在loading的时候调用Class
			//return Constructor;
		}else{
			if(name){
				this.classes[name]= proto;
			}
			//限制不能在loading的时候调用Class
			//return proto;
		}
		
		
		
		function Constructor(){
			// Extend ： 方法重载，执行子类初始化！！！！！
			// Rebuilt： 仅执行子类初始化 
			if(extend=='Extend'&&_cons){
				var me;
				switch(arguments.length){
					case 0:
					me=new _cons();
					break;case 1:
					me=new _cons(arguments[0]);
					break;case 2:
					me=new _cons(arguments[0],arguments[1]);
					break;case 3:
					me=new _cons(arguments[0],arguments[1],arguments[2]);
					break;
				}
				for(var x in me) if(me.hasOwnProperty(x)) this[x]=me[x];
				
			}
			
			switch(arguments.length){
				case 0:
				cons.call(this);
				break;case 1:
				cons.call(this,arguments[0]);
				break;case 2:
				cons.call(this,arguments[0],arguments[1]);
				break;case 3:
				cons.call(this,arguments[0],arguments[1],arguments[2]);
				break;
			}
			
			if(behavior) for(var x in behavior) __behavior[x].Init(behavior[x],this);
			
			if(that.VIEW) return new View(this);
				
			
			return this;
			
		}
		
	}
	
	
	
	
	return Class;
});

