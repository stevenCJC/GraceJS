
	function Router(){
		this.routers={};
		window.addEventListener('hashchange',function(e){
			hashRouter(e);
		},false);
	}
	
	Router.prototype={
		add:function(routers){
			for(var x in routers)
				G.MD.subscribe(x,routers);
		},
	};
	
	
	function hashRouter(e){
		
		var newURL=e.newURL;
		var oldURL=e.oldURL;
		
		var hash=decodeURI(window.location.hash).substr(1);
		if(hash) var hashs=hash.split('/');
		else ;//如果清空
		var subs,index,subs,param,h;
		while(h=hashs.pop()){
			if(h.indexOf(':')>-1) {
				index=h.indexOf(':');
				subs=h.substr(0,index);
				param=h.substr(index+1);
			}else{
				subs=h;
			}
			
			G.MD.publish(subs,param);
			
			
		}
		
	}
	
	
	
	
	