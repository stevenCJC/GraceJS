define(['g','dom/event','oop/Event','_/utils','mediator/main','storage/localstorage'], function(g,DomEvent) {
	
	
	var event={
		__onInstantiate:function(){
			/*
				自动带上命名空间
				
				'someEvent':''
				'click body@.tr.data-item-id':''
				'click .tr.data-item-id':''
				'keydown .tr.data-item-id':''
				'Router:alert':''
				'LS:UID':'',
				
				
			*/
			
			
			
			
		},
		
		
		//各种事件都需要自动绑上当前的命名空间
		on:function(path,cb){
			path=g.u.trim(path);
			if(!path) return;
			var me=this;
			var type;
			var index=path.search(/\:|\s/);
			var t=path.substr(i,1);
			var target=path.substr(index+1);//
			if(index==-1){
				//实例事件
				Event.prototype.on.call(this,path,cb);
			}else{
				type=path.substr(0, index-1);
				switch(type.toLowerCase()){
					case 'ls':
					case 'localstorage':
					g.LS.bind(target+'.'+this._sid,cb);
					break;
					case 'r':
					case 'router':
					//路由跟信息中心结合的情况
					g.sub(target+'.Router.'+this._sid,cb,this);
					
					break;
					default:
					//dom事件
					if(t==' '){
						var delegate;
						if(target.indexOf('@')>-1){
							target=target.split('@');
							delegate=target[0];
							target=target[1];
						}
						
						type=type.replace(/\,/g,'.'+this._sid+',');
						type=type+'.'+this._sid;
						
						if(!this._domEvent) this._domEvent = new DomEvent();
						if(delegate)
							me._domEvent.bind(delegate,type, target, null, function(e){
								cb.call(me,e,$(this));
							});
						else //如果dom事件没有委托
							me._domEvent.bind(target,type, null, null, function(e){
								cb.call(me,e,$(this));
							});
					}
					break;
				}
			}
			
		},
		
		off:function(path){
			path=g.u.trim(path);
			if(!path) return;
			var me=this;
			var type;
			var index=path.search(/\:|\s/);
			var t=path.substr(i,1);
			var target=path.substr(index+1);//
			if(index==-1){
				//实例事件
				Event.prototype.off.call(this,path);
			}else{
				type=path.substr(0, index-1);
				switch(type.toLowerCase()){
					case 'ls':
					case 'localstorage':
					g.LS.unbind(target+'.'+this._sid);
					break;
					case 'r':
					case 'router':
					//路由跟信息中心结合的情况
					g.unsub(target+'.Router.'+this._sid,this);
					break;
					default:
					//dom事件
					if(t==' '){
						var delegate;
						if(target.indexOf('@')>-1){
							target=target.split('@');
							delegate=target[0];
							target=target[1];
						}
						
						type=type.replace(/\,/g,'.'+this._sid+',');
						type=type+'.'+this._sid;
						
						if(!this._domEvent) this._domEvent = new DomEvent();
						
						if(delegate)
							me._domEvent.unbind(delegate,type, target);
						else //如果dom事件没有委托
							me._domEvent.unbind(target,type);
					}
					break;
				}
			}
			
		},
		
		trigger:function(path){
			path=g.u.trim(path);
			if(!path) return;
			var me=this;
			var type;
			var index=path.search(/\:|\s/);
			var t=path.substr(i,1);
			var target=path.substr(index+1);//
			if(index==-1){
				//实例事件
				Event.prototype.trigger.call(this,path);
			}else{
				type=path.substr(0, index-1);
				switch(type.toLowerCase()){
					case 'ls':
					case 'localstorage':
					g.LS.trigger(target+'.'+this._sid);
					break;
					case 'r':
					case 'router':
					//路由跟信息中心结合的情况
					g.pub(target+'.Router.'+this._sid,this);
					break;
					default:
					//dom事件
					if(t==' '){
						var delegate;
						if(target.indexOf('@')>-1){
							target=target.split('@');
							delegate=target[0];
							target=target[1];
						}
						
						type=type.replace(/\,/g,'.'+this._sid+',');
						type=type+'.'+this._sid;
						
						if(!this._domEvent) this._domEvent = new DomEvent();
						
						if(delegate)
							me._domEvent.trigger(delegate,type, target);
						else //如果dom事件没有委托
							me._domEvent.trigger(target,type);
					}
					break;
				}
			}
		},
		
		
	};
	
	
	
	return event;

});