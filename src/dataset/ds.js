define(['dataset/dsevent','function/getObjByPath','function/setObjByPath','function/delObjByPath'], function(dsevent,getObjByPath,setObjByPath,delObjByPath) {
	
	//数据树节点定义
	function DS(path,ds){
		//当前路径
		if(path.lastIndexOf('/')==path.length-1) path=path.substr(0,path.length-1);
		this.PATH=path;
		//返回数据树相应的数据节点
		this._dataset_=getObjByPath(path,ds);
	}
	DS.prototype={
		
		//应该具备解析字符串值作为数据来源的功能，如 dom:#id.val,DS:path/path/Count
		get:function(path){
			if(path){
				return getObjByPath(path,this._dataset_);
			}else return this._dataset_;
		},
		
		
		trigger : function (path, event) {
			if (!event)
				return;
			var ev = event.split('.'),
			namespace;
			event = ev.shift();
			if (ev.length)
				namespace = ev.join('.')
					dsevent.trigger({
						path : this.PATH+'/'+path,
						event : event,
						namespace : namespace || 'none'
					});
		},
		on : function (path, event, namespace, callback) {
			dsevent.add(this.PATH+'/'+path, event, namespace, callback);
		},
		off : function (path, event, namespace) {
			dsevent.del(this.PATH+'/'+path, event, namespace);
		},
		delete : function (path) {
			var src = delObjByPath(path, this.dataset),
			oldValue = JSONClone(src);

			dsevent.trigger({
				path : this.PATH+'/'+path,
				event : 'delete',
				namespace : 'none',
				oldValue : oldValue
			});
		},
		set : function (path, newValue) {
			var src = getObjByPath(path, this.dataset),
			oldValue = JSONClone(src);

			var event = src ? 'update' : 'create';

			newValue = setObjByPath(path, this.dataset, newValue, 1);

			dsevent.trigger({
				path : this.PATH+'/'+path,
				event : event,
				namespace : 'none',
				newValue : newValue,
				oldValue : oldValue
			});
		},
	}
	
	return DS;
});