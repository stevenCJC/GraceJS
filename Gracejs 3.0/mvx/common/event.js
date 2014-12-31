define(['g','oop/Event','_/utils','mediator/main'], function(g,Event) {
	
	
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
			
			
			if(this.Event){
				
			}
			
		},
		
		
		
		on:function(path,cb){
			path=g.u.trim(path);
			if(!path) return;
			var ev;
			var index=path.search(/\W/);
			if(index==-1){
				
			}else{
				ev=path.substr(0, index-1);
				switch(ev.toLowerCase()){
					case 'ls':
					case 'localstorage':
					
					break;
					case 'ss':
					case 'sessionstorage':
					
					break;
					case 'r':
					case 'router':
					//路由跟信息中心结合的情况
					g.sub(path.substr(index+1),cb,this);
					
					break;
					default:
					
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