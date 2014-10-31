define(["$"], function($) {
	$.r=r;
	function r(url,data,type,datatype,success,error,debug){
		if(!window.DEBUG&&!url)return;
		if(!data)data={};
		if(!type)type='POST';
		else type=type.toUpperCase();
		if(!datatype)datatype='json';
		if(!success)success=function(){};
		if(!error)error=function(e){alert(e.message);};
		var error_=function(e){
			if(window.DEBUG&&debug){
				success(debug);
			}else error(e);
		};
		$.ajax({
			url:url,
			data:data,
			type:type,
			dataType:datatype,
			success:function(data){
				if(datatype=='json'&&data&&(data.constructor==Object||data.constructor==Array)){
					if(data.return===false) error_(data);
					else success(data);
				}else if(datatype!='json') success(data);
				else error_(data);
			},
			error:error_,
		});
	}
	return r;
	
});








