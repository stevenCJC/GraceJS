define(['$','./template/underscore','./var/_tpl'], function($,template,_tpls) {
	
	$.tpl=function(tplName, options){
		
		function empty(){};
		if(typeof options=='function'){
			options={
				tplName:tplName,
				onRrequest:empty,
				onLoad:empty,
				onCompile:options,
				onError:empty,
				html:false,
			};
		}else if(typeof options=='object'){
			options=$.extend({
				tplName:tplName,
				onRrequest:empty,
				onLoad:empty,
				onCompile:empty,
				onError:empty,
				html:false,
			},options||{});
		}
		
		if(options.html){
			if(_tpls[tplName]){
				options.onCompile(_tpls[tplName],options);
			}else{
				
				options.onRrequest(options);
				$.ajax({
					url:options.html,
					type:'get',
					success:function(tplData){
						if(options.onLoad){
							var ol=options.onLoad(tplData,options);
							if(ol)tplData=ol;
						}
						_tpls[tplName]=template(tplData);
						options.onCompile(_tpls[tplName],options);
					},
					error:function(e){
						options.onError(e);
					},
				});
			}
		}else if(_tpls[tplName]){
			options.onCompile(_tpls[tplName],options);
		}else options.onError(e);
		
	
	
		
		
	}
	
	return $;
});