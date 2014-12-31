define(['function/urlData'], function(urlData) {
	/*
	localhost#view!1,2,3/tab!noteAll
	hashChange事件触发后会对比新旧hash每个单位的改变
	有新增或者改变
	
	*/
	function Router(callback){
		this.routers={};
		//绑定hash改变事件
		var that=this;
		window.addEventListener('hashchange',function(e){
			hashRouter(e,callback);
		},false);
	}
	Router.prototype={
		constructor:Router,
	}
	
	function hashRouter(e,callback){
		//下面两个变量暂无作用
		var subs,index,subs,param,h,hash,hashs,oldHash,hashChanges={};
		var newURL=e.newURL;
		var oldURL=e.oldURL;
		index=oldURL.indexOf('#');
		hash=oldURL.substr(index);
		oldHash=hash.split('/');
		if(window.location.hash)hash=decodeURI(window.location.hash).substr(1);
		if(hash) hashs=hash.split('/');//如果有hash则以/分拆路径
		else return;//如果没有hash则停止执行
		
		while(h=hashs.pop()){
			if(h.indexOf('!')>-1) {
				index=h.indexOf('!');
				subs=h.substr(0,index);
				param=h.substr(index+1);
			}else{
				subs=h;
			}
			
			aHash:for(var i=0,len=oldHash;i<len&&oldHash[i];i++){
				if(oldHash[i].indexOf(subs+'!')==0){
					if(oldHash[i].indexOf('='+param)!=oldHash[i].indexOf('!')){
						//改变的触发器
						hashChanges[subs]=urlData(param);
						continue aHash;
					}else continue aHash;
				}
				//新增的触发器
				if(i==len-1) hashChanges[subs]=urlData(param);
			}
			
		}
		
		callback(hashChanges,newURL,oldURL);
		
	}
	
	return Router;
	
});
	