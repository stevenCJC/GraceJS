define(['g','oop/Event','_/SDD'], function(g,Event) {
	/*
	localhost#view!1,2,3/tab!noteAll
	hashChange事件触发后会对比新旧hash每个单位的改变
	有新增或者改变
	
		#router:key=value&key2=value2/router1:1,false,somestring/view:122231
		#name=1,2,3&id=321&
		存储页面状态
		
		
	*/
	
	// 跟全局中介合并
	
	function Router(){
		//绑定hash改变事件
		var me=this;
		this.handles=new Event();
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
				this.handles.trigger(diff[i].name,diff[i]);
			}
			
		},
		
		
		// 路由的事件空间跟全局中介结合则部分方法变得无用
		on:function(name,cb,context){
			this.handles.on(name,cb,context);
		},
		
		off:function(name){
			this.handles.off(name);
		},
		
		once:function(name,cb,context){
			this.handles.once(name,cb,context);
		},
		
		trigger:function(name,newData,context){
			var hash=parseHash();
			var names=name.split(/\,| /g);
			while(name=names.pop()){
				this.handles.trigger(name,{name:x,newValue:newData,oldValue:hash[name]},context);
			}
			this.set(names.join(','),newData,true);
		},
		
		set:function(name,data,silent){
			if(!name) throw 'can not set value without a router name.';
			var url=window.location;
			var index=url.indexOf('#');
			var loc=url.substr(0,index);
			var hash=parseHash(),tmp;
			if(name.constructor==String){
				var names=name.split(/\,| /g);
				while(name=names.pop()){
					tmp=hash[name];
					hash[name]=data;
					silent&&this.handles.trigger(name,{name:x,newValue:data,oldValue:tmp});
				}
			}else if(name.constructor==Object){
				for(var x in name){
					tmp=hash[x];
					hash[x]=name[x];
					silent&&this.handles.trigger(x,{name:x,newValue:name[x],oldValue:tmp});
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
			var names=name.split(/\,| /g),tmp;
			while(name=names.pop()){
				tmp=hash[name];
				delete hash[name];
				silent&&this.handles.trigger(name,{name:name,newValue:undefined,oldValue:tmp});
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
	