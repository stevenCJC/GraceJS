
	//DataSet管理类，无依赖
	
	function DataSet(){
		//数据岛的数据树
		this.dataset={};
		this.handlers={};
	}
	
	DataSet.prototype={
		//path:	路径
		//ds:	数据
		//that:	数据源对象
		initData:function(path,ds){
			if(ds){
				ds=clone(ds);//深克隆
				var dso= getObjByPath(path,this.dataset,1);//获得对象，强制生成
				if(ds.constructor==Array) {
					//如果是数组，说明对象是可以初始化多个实例，影响也有所区别，所以需要解析路径，此处应该把路径的解析独立处理
					dso[ds[0]]=ds[1];
				}else if(ds.constructor==Object){
					//如果是对象，即只需初始化一个实例即可
					for(var x in ds)if(ds.hasOwnProperty(x)) dso[x]=ds[x];
				}
			}
		},
		getDS:function(path){
			//返回新的数据树节点实例
			return new DS(path,this.dataset);
		},
		//启动事件触发
		trigger:function(path,type,newData,oldData){
			
		},
	}
	
	//数据树节点定义
	function DS(path,ds){
		//当前路径
		this.PATH=path;
		//返回数据树相应的数据节点
		this._dataset_=getObjByPath(path,ds,1);
	}
	DS.prototype={
		get:function(path){
			path=path.replace(/\s/ig,'');
			if(path){
				if(path.indexOf('/')>-1) return getObjByPath(path,this._dataset_);
				else return this._dataset_[path];
			}else return this._dataset_;
		},
		
		//这里可能会引起update和create事件的触发
		set:function(path,value){
			var obj;
			if(value.constructor==Object){
				//如果值为对象，只需要扩展源对象即可
				if(path.indexOf('/')>-1) obj=getObjByPath(path,this._dataset_,1);
				else obj=this._dataset_[path];
				for(var x in value)if(value.hasOwnProperty(x)) obj[path]=value[x];
			}else{
				//如果值不为对象，则需要找到目标对象所在的父对象
				//如果path是多个节点
				if(path.indexOf('/')>-1){
					path=path.replace(/\s/ig,'').split('/');
					var key=path.pop();//对应的键
					//返回父对象
					if(path.length>1) obj=getObjByPath(path.join('/'),this._dataset_,1);
					else if(path.length==1) obj=this._dataset_[path[0]];
				//如果path为根的子节点
				}else obj=this._dataset_;
				obj[path]=value;
			}
		},
		//这里可能会引起delete事件的触发
		delete:function(path){
			var srcPath=this.PATH+'/'+srcPath;
			path=path.replace(/\s/ig,'').split('/');
			var p=path.pop();
			path=path.join('/');
			if(path){
				if(path.indexOf('/')>-1){
					delete getObjByPath(path,this._dataset_)[p];
					event(this.handlers[srcPath],srcPath);
				}else {
					delete this._dataset_[path][p];
				}
			}else {
				delete this._dataset_[p];
			}
			
			function event(h,path){
				if(h){
					for(var x in h){
						if(x.indexOf('delete')==0||x.indexOf('all')==0){
							h[x]();
						}
					}
				}
			}
		},
		// 提供绑定事件类型有 update delete create all
		// 这里需要支持末尾为/的绑定，绑定指向末尾的所有数据包括其各级子数据
		// 事件触发要伴随变化前数据和变化后数据
		// 需要支持命名空间
		bind:function(path,event,handlers){
			if(path.constructor==Function) {
				//如果参数只有一个函数，则对当前路径进行绑定
				callback=path;
				path=this.PATH;
				event='all';
			}else if(event.constructor==Function){//如果第二个参数为函数
				callback=event;
				//如果path为事件名称，则使用当前PATH，以及path作为event
				//.后面作为事件命名空间
				if('|update|delete|create|'.indexOf('|'+path.split('.')[0]+'|')>-1){
					event=path;
					path=this.PATH;
				}else{
					//否则认为path参数不为event
					event='all';
					path=this.PATH+'/'+path;//连接成完整的path
				}
			}
			for(var x in handlers){
				//这里应该使用时间管理类进行管理
				var h=this.handlers[path]=this.handlers[path]||{};
				h=h[event]=h[event]||[];
				h.push(handlers);
			}
		},
		//需要事件管理类
		//删除数据事件绑定
		unbind:function(path,event){
			if('|update|delete|create|'.indexOf('|'+path.split('.')[0]+'|')>-1){
				event=path;
				path=this.PATH;
			}else{
				event='all';
				path=this.PATH+'/'+path;
			}
			
			if(event=='all'){
				delete this.handlers[path];
			}else{
				var h=this.handlers[path];
				for(var x in h)
					if(x.indexOf(event)==0) delete h[x];
			}
			
		},
		//启动事件触发
		trigger:function(path,type,newData,oldData){
			
			
		},
	}
	
	//替换path里面的变量，如{id}
	function fixPath(path,obj){
		return path.replace(/(^\s*)|(\s*$)/g,'').replace(/\{.*?\}/ig,function(m){
			return obj[m.replace(/\{|\}/ig,'')];
		});
	}
	
	//根据路径返回对象
	//path		数据路径
	//obj		基础对象
	//create	是否进行创建路径，如果否，返回null
	function getObjByPath(path,obj,create){
		path=path.replace(/(^\s*)|(\s*$)/g,'');
		var tmp;
		if(path.indexOf('/')>-1){
			path=path.split('/');
			var x;
			while(x=path.shift()){
				if(typeof obj[x]!='undefined'){
					obj=obj[x];
					if(path.length>0&&typeof obj!='object') 
						throw new Error('The '+x+' related to the node of Object is not an Object type');
				}else if(create){//如果子路径元素不存在，并且需要创建
					if(path.length){//路径中遇到undefined
						obj=obj[x]={};//创建路径
					}else {//终端
						obj[x]={};//创建路径
						return obj[x];
					}
				//如果子路径不存在，并且不需要创建
				}else return;
			}
			return obj;
		}else if(typeof obj[path]!='undefined'){
				return obj[path];
			}else if(create){
				obj[path]={};
				return obj[path];
			}else return;
	}
	

	//深克隆函数
	function clone(item) { 
		if (!item) { return item; } // null, undefined values check 
	 
		var types = [ Number, String, Boolean ],  
			result; 
	 
		// normalizing primitives if someone did new String('aaa'), or new Number('444');    
		//一些通过new方式建立的东东可能会类型发生变化，我们在这里要做一下正常化处理 
		//比如new String('aaa'), or new Number('444') 
		types.forEach(function(type) { 
			if (item instanceof type) { 
				result = type( item ); 
			} 
		}); 
	 
		if (typeof result == "undefined") { 
			if (Object.prototype.toString.call( item ) === "[object Array]") { 
				result = []; 
				item.forEach(function(child, index, array) {  
					result[index] = clone( child ); 
				}); 
			} else if (typeof item == "object") { 
				// testign that this is DOM 
				//如果是dom对象，那么用自带的cloneNode处理 
				if (item.nodeType && typeof item.cloneNode == "function") { 
					var result = item.cloneNode( true );     
				} else if (!item.prototype) { // check that this is a literal 
					// it is an object literal       
				//如果是个对象迭代的话，我们可以用for in 迭代来赋值 
					result = {}; 
					for (var i in item) { 
						result[i] = clone( item[i] ); 
					} 
				} else { 
					// depending what you would like here, 
					// just keep the reference, or create new object 
					//这里解决的是带构造函数的情况，这里要看你想怎么复制了，深得话，去掉那个false && ，浅的话，维持原有的引用，                 
					//但是我不建议你去new一个构造函数来进行深复制，具体原因下面会解释 
					if (false && item.constructor) { 
						// would not advice to do that, reason? Read below 
					//朕不建议你去new它的构造函数 
						result = new item.constructor(); 
					} else { 
						result = item; 
					} 
				} 
			} else { 
				result = item; 
			} 
		} 
	 
		return result; 
	} 

	







