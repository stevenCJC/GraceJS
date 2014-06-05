define(["jquery",'underscore','utils/tips','utils/msg'],
function($,_,tips,msg) {
	window.TPL=window.TPL||{};
	
	$.loadTPL = function(tplName,options){
		
		if(typeof options=='function'){
			options={
				onCompile:options,
				tips:false,
				tplName:tplName,
				onRrequest:null,
				onLoad:null,
				//onError:null,
				html:false,
			};
		}else if(typeof options=='object'){
			options=$.extend({
				tips:false,
				tplName:tplName,
				onRrequest:null,
				onLoad:null,
				onCompile:null,
				html:false,
			},options||{});
		}
			
		if(options.html){
			if(window.TPL[tplName]){
				setTimeout(function(){
					options.onCompile(window.TPL[tplName],options);
				},1);
			}else{
				
				if(options.tips){
					if(options.tips.constructor==String) tips.show(options.tips);
					else tips.show('加载中...');
				}
				if(options.onRrequest)options.onRrequest(options);
				$.ajax({
					url:options.html,
					type:'get',
					success:function(tplData){
						
						tplData=importTpl(tplData);
						
						
						if(options.onLoad){
							var ol=options.onLoad(tplData,options);
							if(ol)tplData=ol;
						}
						window.TPL[tplName]=_.template(tplData);
						options.onCompile(window.TPL[tplName],options);
						if(options.tips) tips.hide();
					},
					error:function(e){
						msg.say({text:"文件：'"+options.html+"' 加载失败。"})
					},
				});
			}
		}else if(window.TPL[tplName]){
			setTimeout(function(){
				options.onCompile(window.TPL[tplName],options);
			},1);
		}else msg.say({text:"没有加载资源："+tplName});
		
	
	
		
		
	}
	
	//嵌套模板
	function importTpl(tplData){
		if(!tplData)return;
		
		return tplData.replace(/\<\%\@import\s*?[\'\"].+?[\'\"]\s*?\%\>/ig,function(it){
			var tpldata;
			var url=it.replace(/\<\%\@import\s*?[\'\"]|[\'\"]\s*?\%\>/ig,'').replace(/\~/,window.info.assets);
			
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


	
});


