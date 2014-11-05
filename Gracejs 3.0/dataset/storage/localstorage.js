define([],
function() {
	return {
		//func:::function(newValue,oldValue,url){}
		bind:function(key,func){
			window._lsHandles_[key]=func;
		},
		set:function(key,value,doThisPage){
			if(doThisPage!==false) doThisPage=true;
			if(value.constructor==String||!isNaN(value)){//当前页检测事件执行
			if(!isNaN(value))value=value.toString();
				doThisPage&&onStorageChange(key, value, window.localStorage[key],window.location.href);
				window.localStorage[key]=value;
			}else if(value.constructor==Object){//当前页检测事件执行
				doThisPage&&onStorageChange(key, JSON.stringify(value), window.localStorage[key],window.location.href);
				window.localStorage[key]=JSON.stringify(value);
			}
		},
		
		get:function(key){
			var tmp=window.localStorage[key];
			if(tmp&&tmp.charAt(0)=="{"&&tmp.indexOf(":")>0&&tmp.charAt(tmp.length-1)=="}") return JSON.parse(tmp);
			else if(tmp=="{}") return JSON.parse(tmp);
			else return tmp;
		},
		delete:function(key){
			if(window.localStorage[key]) window.localStorage.removeItem(key);
		},
		clear:function(key){
			window.localStorage.clear();
		},
	}
});

function onStorageChange(key,nV,oV,url){
	if(nV&&nV.charAt(0)=="{"&&nV.indexOf(":")>0&&nV.charAt(nV.length-1)=="}") nV= JSON.parse(nV);
	if(oV&&oV.charAt(0)=="{"&&oV.indexOf(":")>0&&oV.charAt(oV.length-1)=="}") oV= JSON.parse(oV);
	if(window._lsHandles_[key]) 
		window._lsHandles_[key](nV,oV,url);
}

//非当前页检测事件执行
window.addEventListener("storage",function(e){
	onStorageChange(e.key,e.newValue,e.oldValue,e.url);
},false);
