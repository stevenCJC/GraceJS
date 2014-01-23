
	
	function DataSet(){
		this.dataset={};
	}
	
	DataSet.prototype={
		
		initData:function(path,ds,that){
			ds=clone(ds);//深克隆
			var dso= getObjByPath(path,this.dataset,1)
			if(ds){
				if(ds.constructor==Array) {
					var k=ds[0].replace(/(^\s*)|(\s*$)/g,'').replace(/\{.*?\}/ig,function(m){
						return that[m.replace(/\{|\}/ig,'')];
					});
					dso[k]=ds[1];
				}else if(ds.constructor==Object){
					for(var x in ds)if(ds.hasOwnProperty(x)) dso[x]=ds[x];
				}
			}
		},
		getDS:function(path){
			return new DS(path,this.dataset);
		},
	}
	
	function DS(path,ds){
		this.path=path;
		this._dataset_=getObjByPath(path,ds);
	}
	DS.prototype={
		get:function(key){
			if(key)return this._dataset_[key];
		},
		set:function(key,value){
			this._dataset_[key]=value;
		},
		delete:function(key){
			
		},
		push:function(key,value){
			
		},
		splice:function(){
			
		},
		bind:function(){
			
		},
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

	







