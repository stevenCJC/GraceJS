define(['g','./request'], function (g,request) {
	
	
	var ajax = g.ajax ={
		request : function(opts){
			return request(opts);
		},
		get : function (url) {
			var t, data={}, dataType='html',success=empty,error=empty;
			for(var i=1,len=arguments.length;i<len;i++){
				t=arguments[i];
				switch(typeof t){
					case'string':
					if(t.indexOf('=')>-1) data=t;
					else {
						dataType=t;
					}
					break;
					case'object':
					data=t;
					break;
					case'function':
					if(success===empty)success=t;
					else error=t;
					break;
				}
			}
	
			return request({
				url : url,
				data : data,
				dataType : dataType,
				success : success,
				error:error,
			});
		},
	
		post : function (url) {
			var t, data={}, dataType='html',success=empty,error=empty;
			for(var i=1,len=arguments.length;i<len;i++){
				t=arguments[i];
				switch(typeof t){
					case'string':
					if(t.indexOf('=')>-1) data=t;
					else {
						dataType=t;
					}
					break;
					case'object':
					data=t;
					break;
					case'function':
					if(success===empty)success=t;
					else error=t;
					break;
				}
			}
			return request({
				url : url,
				type : "POST",
				data : data,
				dataType : dataType,
				success : success,
				error:error,
			});
		},
	}

	return ajax;
});
