define(['dataset/DSEvent','function/getObjByPath','function/setObjByPath','function/delObjByPath','function/JSONClone'], function(DSEvent,getObjByPath,setObjByPath,delObjByPath,JSONClone) {
	
	//数据树节点定义
	function DS(path,ds){
	
		if(!path||path.constructor!=Object&&path.constructor!=Array) return new DS({});
		
		if(arguments.length==1){
			ds=path;
			path='';
		}
		
		var base = ds.constructor==DS?ds:null;
		if(base) ds = base.dataset;
		//当前路径
		if(path.lastIndexOf('/')==path.length-1) path=path.substr(0,path.length-1);
		
		//返回数据树相应的数据节点
		
		this.dataset=getObjByPath(path,ds);
		
		this.baseDataset=base||this;
		
		this.PATH=this.baseDataset.PATH?(this.baseDataset.PATH+'/'+path):path;
		this.event=this.baseDataset.event||new DSEvent();
	}
	
	DS.prototype={
		
		getDS:function(path){
			return new DS(this.PATH+'/'+path,this.baseDataset);
		},
		
		//应该具备解析字符串值作为数据来源的功能，如 dom:#id.val,DS:path/path/Count
		get:function(path){
			if(path){
				return getObjByPath(path,this.dataset);
			}else return this.dataset;
		},
		
		
		trigger : function (path, event) {
			if (!event)
				return;
			var ev = event.split('.'),
			namespace;
			event = ev.shift();
			if (ev.length)
				namespace = ev.join('.')
					this.event.trigger({
						path : this.PATH+'/'+path,
						event : event,
						namespace : namespace || 'none'
					});
		},
		bind : function (path, event, callback) {
			var namespace;
			if(event.indexOf('.')>-1) {
				var tmp=event.split('.');
				namespace=tmp[0];
				event=tmp[1];
			}
			this.event.add(this.PATH+'/'+path, event, namespace, callback);
		},
		unbind : function (path, event) {
			var namespace;
			if(event.indexOf('.')>-1) {
				var tmp=event.split('.');
				namespace=tmp[0];
				event=tmp[1];
			}
			this.event.del(this.PATH+'/'+path, event, namespace);
		},
		delete : function (path) {
			var src = delObjByPath(path, this.dataset),
			oldValue = JSONClone(src);

			this.event.trigger({
				path : this.PATH+'/'+path,
				event : 'delete',
				namespace : 'none',
				oldValue : oldValue
			});
		},
		set : function (path, newValue) {
			if(arguments.length==2){
				var src = getObjByPath(path, this.dataset),
				oldValue = src;

				var event = typeof src!='undefined' ? 'update' : 'create';

				newValue = setObjByPath(path, this.dataset, newValue, 1);

				this.event.trigger({
					path : this.PATH+'/'+path,
					event : event,
					namespace : 'none',
					newValue : newValue,
					oldValue : oldValue
				});
			}else if(arguments.length==1){
				this.dataset=path;
				this.event.trigger({
					path : this.PATH||'',
					event : 'create',
					namespace : 'none',
					newValue : newValue,
					oldValue : this.dataset
				});
			}
		},
	}
	
	return DS;
});