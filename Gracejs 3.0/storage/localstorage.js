define(['g','_/string'], function(g) {
	
	function LocalStorage(){
		this.handles={};
		var me=this;
		//非当前页检测事件执行
		window.addEventListener("storage", function(e) {
			if(e.storageArea.storageTypeMark=='local')
				me._onStorageChange(e.key, e.newValue, e.oldValue, e.url, e);
		}, false);
		window.localStorage['storageTypeMark'] = 'local';
	}
	
	LocalStorage.prototype={
		constructor:LocalStorage,
		
		bind: function(key, func) {
			this.handles[key]=this.handles[key]||[];
			this.handles[key].push(func);
		},
		set: function(key, value, doThisPage) {
			if (typeof value == 'undefined') value = "";
			if (doThisPage !== false) doThisPage = true;
			if (value.constructor == String || !isNaN(value)) { //当前页检测事件执行
				if (!isNaN(value)) value = value.toString(); 
				doThisPage && onStorageChange(key, value, window.localStorage[key], window.location.href);
				window.localStorage[key] = value;
			} else if (value.constructor == Object||value.constructor == Array) { //当前页检测事件执行
				window.localStorage[key] = JSON.stringify(value);
				doThisPage && onStorageChange(key, JSON.stringify(value), window.localStorage[key], window.location.href);

			}
		},

		get: function(key) {
			var tmp = window.localStorage[key];
			return g.s.ifJson(tmp);
		},
		delete: function(key) {
			if (window.localStorage[key]) window.localStorage.removeItem(key);
		},
		clear: function(key) {
			window.localStorage.clear();
		},
		
		_onStorageChange:function (key, nV, oV, url,event) {
			nV = g.s.ifJson(nV);
			oV = g.s.ifJson(oV);
			if (this.handles[key]){
				for(var i=0;i<this.handles[key].length;i++){
					this.handles[key][i](nV, oV, url,event);
				}
			}
		}
	};
	
	g.LS=g.localStorage=new LocalStorage();
	
	return g.LS;
	
	
});