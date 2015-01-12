define(['g','_/SDD','mediator/main'], function(g) {
	/*
	localhost#view!1,2,3/tab!noteAll
	hashChange事件触发后会对比新旧hash每个单位的改变
	有新增或者改变
	
		#router:key=value&key2=value2/router1:1,false,somestring/view:122231
		#name=1,2,3&id=321&
		存储页面状态
		
		
	*/
	
	
	
	function Router(){
		//绑定hash改变事件
		var me=this;
		window.addEventListener('hashchange',function(e){
			me.listen(e);
		},false);
		
		/*g.q(document).on('click','a[href^="#"]',function(e){
			e.preventDefault();
			var hash=parseHash(this.href);
			if(hash) me.set(hash);
		});*/
	}
	Router.prototype={
		constructor:Router,
		
		
		listen:function(e){
			var diff=hashDiff(parseHash(e.newURL),parseHash(e.oldURL));
			for(var i=0;i<diff.length;i++){
				g.pub(diff[i].name,diff[i].newValue);
			}
		},
		
		
		set:function(name,data,silent){
			if(!name) throw 'can not set value without a router name.';
			var url=window.location;
			var index=url.indexOf('#');
			var loc=url.substr(0,index);
			var hash=parseHash();
			if(name.constructor==String){
				var names=name.split(/\,| /g);
				while(name=names.pop()){
					hash[name]=data;
					silent&&g.pub(name,data);
				}
			}else if(name.constructor==Object){
				for(var x in name){
					hash[x]=name[x];
					silent&&g.pub(x,name[x]);
				}
			}
			window.history.replaceState(null, null,loc+hash);
		},
		
		get:function(name){
			var hash=parseHash();
			if(!name) return hash;
			return hash[name];
		},
		
		remove:function(name,silent){
			var url=window.location;
			var index=url.indexOf('#');
			var loc=url.substr(0,index);
			var hash=parseHash();
			var names=name.split(/\,| /g);
			while(name=names.pop()){
				delete hash[name];
				silent&&g.pub(name,undefined);
			}
			window.history.replaceState(null, null,loc+hash);
		},
		
		
	}
	
	
	function parseHash(url){
		if(!url) url=window.location.hash;
		var index=url.indexOf('#');
		var hash=url.substr(index+1);
		return g.sdd.parse(hash);
	}
	
	function hashDiff(newObj,oldObj){
		newObj=newObj||{};
		oldObj=oldObj||{};
		var diff=[]; // [{name:'',newValue:'',oldValue:''}];
		var t1,t2;
		
		// 新增，更改
		for(var x in newObj){
			t1=typeof newObj[x];
			t2=typeof oldObj[x];
			if(t1==t2) {
				if(t1=='object'&&JSON.stringify(newObj[x])!=JSON.stringify(oldObj[x])||oldObj[x]!=newObj[x]) 
					diff.push({name:x,newValue:newObj[x],oldValue:oldObj[x]});
			}else diff.push({name:x,newValue:newObj[x],oldValue:oldObj[x]});
		}
		// 删除
		for(var x in oldObj) 
			if(newObj[x]==undefined) 
				diff.push({name:x,newValue:newObj[x],oldValue:oldObj[x]});
		
		return diff;
	}
	
	
	
	return Router;
	
});
	