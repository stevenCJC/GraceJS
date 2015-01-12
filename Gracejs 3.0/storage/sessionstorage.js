define(['g','_/string'], function(g) {

	 g.SS=g.sessionStorage= {
		
		set: function(key, value) {
			if (typeof value == 'undefined') value = "";
			if (value.constructor == String || !isNaN(value)) { //当前页检测事件执行
				if (!isNaN(value)) value = value.toString();
				window.sessionStorage[key] = value;
			} else if (value.constructor == Object||value.constructor == Array) { //当前页检测事件执行
				window.sessionStorage[key] = JSON.stringify(value);
			}
		},

		get: function(key) {
			var tmp = window.sessionStorage[key];
			return g.s.ifJson(tmp);;
		},
		
		delete: function(key) {
			if (window.sessionStorage[key]) window.sessionStorage.removeItem(key);
		},
		
		clear: function(key) {
			window.sessionStorage.clear();
		},
		
	}
	
	return g.SS;

});