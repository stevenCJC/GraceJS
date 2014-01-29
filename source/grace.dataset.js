
	//DataSet管理类，无依赖
	
	function DataSet(){
		//数据岛的数据树
		this.dataset={};
		this.handlers={};
	}
	
	DataSet.prototype={
		//path:路径
		//ds:数据
		//that:数据源对象
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
		//要考虑尾部为 / 的情况，对子元素的操作，和事件
		//事件要伴随变化前数据和变化后数据
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
		// update delete create
		// dataset/count/
		bind:function(path,event,handlers){
			if(path.constructor==Function) {
				callback=path;
				path=this.PATH;
				event='all';
			}else if(event.constructor==Function){
				callback=event;
				if('|update|delete|create|'.indexOf('|'+path.split('.')[0]+'|')>-1){
					event=path;
					path=this.PATH;
				}else{
					event='all';
					path=this.PATH+'/'+path;
				}
			}
			for(var x in handlers){
				var h=this.handlers[path]=this.handlers[path]||{};
				h=h[event]=h[event]||[];
				h.push(handlers);
			}
		},
		//未完成
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
	}
	
	
	function fixPath(path,obj){
		return path.replace(/(^\s*)|(\s*$)/g,'').replace(/\{.*?\}/ig,function(m){
			return obj[m.replace(/\{|\}/ig,'')];
		});
	}
	
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
				}else if(create){
					if(path.length){//路径中遇到undefined
						obj=obj[x]={};
					}else {//终端
						obj[x]={};
						return obj[x];
					}
				}else return;
			}
			return obj;
		}else if(typeof obj[path]!='undefined'){
				return obj[path]
			}else if(create){
				obj[path]={};
				return obj[path];
			}else return;
	}
	

	
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

	







