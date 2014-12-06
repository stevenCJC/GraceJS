define(["g",'./compliler/usCompliler','ajax/ajax'], function(g,compliler) {
	
	g.template.load = function(html,onOK,onErr,async,type){
		
		if(async==undefined) async=true;
		if(!onOK) async=false;
		var tpl;
		if(html){
			g.ajax.request({
				url:html,
				async:async,
				type:type||'get',
				success:function(tplData){
					tplData=importTpl(tplData);
					try {
						tpl=compliler(tplData,html);
					} catch (e) {
						onErr(e);
						console.error(e);
					}
					onOK&&onOK(tpl);
				},
				error:function(e){
					onErr(e);
					console.error(e);
				},
			});
			if(!async) return tpl
		}
	}
	
	//嵌套模板
	function importTpl(tplData){
		if(!tplData)return;
		
		return tplData.replace(/\<\%\@import\s*?[\'\"].+?[\'\"]\s*?\%\>/ig,function(it){
			var tpldata;
			var url=it.replace(/\<\%\@import\s*?[\'\"]|[\'\"]\s*?\%\>/ig,'').replace(/\~/,window.info.assets);
			
			g.ajax.request({
				url:url,
				type:'get',
				async:false,
				success: function(data){
					tpldata=importTpl(data);
				}
			});
			return tpldata||'';
		});
	}


	
});


