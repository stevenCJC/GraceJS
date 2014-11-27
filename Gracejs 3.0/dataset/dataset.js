define(['./DS', './DSEvent', 'function/getObjByPath', 'function/setObjByPath', 'function/delObjByPath','_/object'], function (DS, DSEvent, getObjByPath, setObjByPath, delObjByPath) {

	function DataSet(data) {
		//数据岛的数据树
		this.dataset = data;
		this.event=new DSEvent();
	}

	DataSet.prototype = {

		
		//Dataset事件触发
		trigger : function (path, event) {
			if (!event)
				return;
			var ev = event.split('.'),
			namespace;
			event = ev.shift();
			if (ev.length)
				namespace = ev.join('.')
					this.event.trigger({
						path : path,
						event : event,
						namespace : namespace || 'none'
					});
		},
		on : function (path, event, namespace, callback) {
			this.event.add(path, event, namespace, callback);
		},
		off : function (path, event, namespace) {
			this.event.del(path, event, namespace);
		},
		delete : function (path) {
			var src = delObjByPath(path, this.dataset),
			oldValue = g.o.JsonClone(src);

			this.event.trigger({
				path : path,
				event : 'delete',
				namespace : 'none',
				oldValue : oldValue
			});
		},
		getDS : function (path) {
			//返回新的数据树节点实例
			return new DS(path, this.dataset);
		},
		get:function(path){
			return getObjByPath(path, this.dataset);
		},
		set : function (path, newValue) {
			var src = getObjByPath(path, this.dataset),
			oldValue = g.o.JsonClone(src);

			var event = typeof src != 'undefined' ? 'update' : 'create';

			newValue = setObjByPath(path, this.dataset, newValue, 1);

			this.event.trigger({
				path : path,
				event : event,
				namespace : 'none',
				newValue : newValue,
				oldValue : oldValue
			});
		},
		
	}

	return DataSet;
});
