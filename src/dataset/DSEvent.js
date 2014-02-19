define([], function() {
	
function DSEvent(){
		this.handle={
			//仅当前节点的更新会触发事件
			'path1/path2':{
				all:{
					namespace:[callback1,callback2],
				},
			},
			//关联事件，关联所有子节点的更新
			'path1/path2/':{
				delete:{
					namespace:[callback1,callback2],
				},
			},
		};
	}
	
	DSEvent.prototype={
		constructor:DSEvent,
		add:function(path,event,namespace,callback){
			if(arguments.length==3){
				callback=namespace;
				namespace='none';
			}
			var hs=this.handle[path]=this.handle[path]||{};
			var ev=hs[event]||{};
			var ns=ev[namespace]||[];
			ns.push(callback);
		},
		//删除委托事件
		del:function(path,event,namespace){
			if(arguments.length==2){
				namespace='none';
			}else if(arguments.length==1){
				namespace='none';
				event='all';
			}
			var hs=this.handle[path];
			if(hs){
				if(event=='all')
					if(namespace=='none') delete this.handle[path];
					else for(var x in hs){
						delete hs[x][namespace];
					}
				else	if(namespace=='none') delete hs[event];
						else hs[event]&&delete hs[event][namespace];
			}
			
		},


		trigger:function(path,event,namespace){
			path=path.replace(/\s/ig,'');
			if(arguments.length==2){
				namespace='none';
			}else if(arguments.length==1){
				namespace='none';
				event='all';
			}
			if(path.lastIndexOf('/')==path.length-1){
				_trigger(this.handle,path,event,namespace);
			}else{
				var p=path.split('/');
				while(p.length){
					_trigger(this.handle,p.join('/'),event,namespace);
					p.pop();
				}
			}
			
			
		},
		

	};
	function _trigger(handles,path,event,namespace){
		var hs=handles[path];
		var es,ns,x,y;
		if(hs){
			if(event=='all')
				if(namespace=='none'){
					for(y in hs)if(ns=hs[y])for(x in ns) ns[x].forEach(function(fn){fn(path,event)});
				}else{
					(ns=hs['delete'])&&ns[namespace]&&ns[namespace].forEach(function(fn){fn(path,event)});
				}
			else if(namespace=='none') if(ns=hs[event])
											for(x in ns) ns[x].forEach(function(fn){fn(path,event)});
				else if(ns=hs[event]) ns[namespace]&&ns[namespace].forEach(function(fn){fn(path,event)});
		}
	}

	return DSEvent;
});



