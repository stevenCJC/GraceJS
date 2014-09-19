define(['$','BL/_/var/_tpls'], function ($,_tpls) {
	$.extend({

		tpl: function(tplName, data) {
			var options={
				name:null,
				url:null,
			};
			
			if($.isObject(tplName)) $.extend(options,tplName);
			else if($.isString(tplName)) options.name=tplName;
			
			if(_tpls[options.name]) this.each(function(){
					$(this).html(_tpls[options.name](data));
				})
			else if(options.url){
				var that=this;
				$.tpl(options.name,{
					html:options.url,
					onCompile:function(tpl){
						that.each(function(){
							$(this).html(tpl(data));
						})
					},
				});
			}else throw new Error('no such template : '+ options.name);

		}
		
	});
});

