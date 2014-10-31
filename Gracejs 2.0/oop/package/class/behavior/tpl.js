define(['$','BL/_/template/underscore','Config'], function($,template,Config) {
	
	
	_behavior['view'].Tpl={
		Build:function(tpl,cons){
			
		},
		Init:function(tpl,that){
			that.Tpl={};
			that.template={};
			for(var x in tpl){
				(function(x){
					that.Tpl[x]=function(callback,async){
						
						if(async!==false&&async||typeof async=='undefined') async=true;
						else if(async!==false&&!async) async=false;
						
						if(tpl[x].constructor==String){
							
							$.ajax({
								url:tpl[x],
								async:async,
								type:'get',
								success:function(tplData){
									that.template[x]=template(importTpl(tplData));
									callback(that.template[x]);
								},
								
							});
								
							
						}else if(tpl[x].constructor==Function){
							that.template[x]=tpl[x];
							if(async)
								setTimrout(function(){
									callback(tpl[x]);
								},0);
							else callback(tpl[x]);
						}
					};
				})(x);
				
			}
			
		},
	}
	
	
	//嵌套模板
	function importTpl(tplData){
		if(!tplData)return;
		
		return tplData.replace(/\<\%\@import\s*?[\'\"].+?[\'\"]\s*?\%\>/ig,function(it){
			var tpldata;
			var url=it.replace(/\<\%\@import\s*?[\'\"]|[\'\"]\s*?\%\>/ig,'');
			if(Config.path[url[0]]) url=url.replace(url[0],Config.path[url[0]]);
			
			$.ajax({
				url:url,
				type:'get',
				async:false,
				success: function(data){
					tpldata=importTpl(data);
				}
			});
			return tpldata;
		});
	}

	
	return _behavior;
});