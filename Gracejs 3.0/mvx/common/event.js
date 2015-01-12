define(['g','oop/Event','_/utils','mediator/main','dom/event','storage/localstorage','storage/sessionstorage'], function(g,Event) {
	
	
	var event={
		__blacklist__:['_eventInit'],
		_eventInit:function(){
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
		
		
		
		on:function(path,cb){
			path=g.u.trim(path);
			if(!path) return;
			var me=this;
			var type;
			var index=path.search(/\W/);
			var t=path.substr(i,1);
			var target=path.substr(index+1);//
			if(index==-1){
				//实例事件
				this._on(path,cb);
			}else{
				type=path.substr(0, index-1);
				switch(type.toLowerCase()){
					case 'ls':
					case 'localstorage':
					g.LS.on(target,cb);
					break;
					case 'ss':
					case 'sessionstorage':
					g.SS.on(target,cb);
					break;
					case 'r':
					case 'router':
					//路由跟信息中心结合的情况
					g.sub(target+'.Router',cb,this);
					
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
						
						if(delegate)
							g.q(delegate).on(type,target,function(e){
								cb.call(me,e,$(this));
							});
						else if(dom.length==1)//如果dom事件没有委托
							g.q(target).on(type,function(e){
								cb.call(me,e,$(this));
							});
					}
					
					break;
				}
			}
			
		},
		
		off:function(){
			
		},
		
		trigger:function(){
			
		},
		
		
	};
	
	
	
	return event;

});