define([],
function() {
	return {
		bind:function(key,func){
			window._lsHandles_[key]=func;
		},
		set:function(key,value){
			if(value.constructor==String) window.localStorage[key]=value;
			else if(value.constructor==Object) window.localStorage[key]=JSON.stringify(value);
		},
		get:function(key){
			var tmp=window.localStorage[key];
			if(tmp&&tmp.charAt(0)=="{"&&tmp.indexOf(":")>0&&tmp.charAt(tmp.length-1)=="}") return JSON.parse(tmp);
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

window.addEventListener("storage",function(e){
	if(window._lsHandles_[e.key]) 
		window._lsHandles_[e.key](e.newValue,e.oldValue,e.url);
},false);
