define(['dataset/DSEvent','function/getObjByPath'], function(DSEvent,getObjByPath) {
	
	//数据树节点定义
	function DS(path,ds){
		//当前路径
		this.PATH=path;
		//返回数据树相应的数据节点
		this._dataset_=getObjByPath(path,ds,1);
	}
	DS.prototype={
		
		//应该具备解析字符串值作为数据来源的功能，如 dom:#id.val,DS:path/path/Count
		get:function(path){
			path=path.replace(/\s/ig,'');
			if(path){
				if(path.indexOf('/')>-1) return getObjByPath(path,this._dataset_);
				else return this._dataset_[path];
			}else return this._dataset_;
		},
		
		//这里会引起update或create事件的触发
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
			var srcPath=this.PATH+'/'+path;
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
		//删除数据事件绑定  		//  采用dom事件委托方式
		unbind:function(path,event){
			//.后面作为事件命名空间
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
		//Dataset事件触发
		trigger:function(path,type,newData,oldData){
			
			
		},
	}
	
	return DataSet;
});