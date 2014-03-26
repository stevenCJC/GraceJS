define(["jquery",'utils/tips'],
function($,tips) {
	window.TPL=window.TPL||{};
	
	$.loadTPL = function(tplName,options){
		
		if(typeof options=='function'){
			options={
				onCompile:options,
				tips:false,
				tplName:tplName,
				onRrequest:null,
				onLoad:null,
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
				options.onCompile(window.TPL[tplName],options);
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
						if(options.onLoad){
							var ol=options.onLoad(tplData,options);
							if(ol)tplData=ol;
						}
						window.TPL[tplName]=$.template(tplData);
						options.onCompile(window.TPL[tplName],options);
						if(options.tips) tips.hide();
					},
					error:function(e){
						msg.fail("文件：'"+options.html+"' 加载失败。")
					},
				});
			}
		}else if(window.TPL[tplName]){
			options.onCompile(window.TPL[tplName],options);
		}else msg.fail("没有加载资源："+tplName);
		
	
	
		
		
	}
	



	
});


