define(['pk'],function($){
	
	/*
		var chzn=$().chzn();//检测初始化状态，自动调用init， 返回 chzn 的 instance;
		chzn.destroy();
		chzn.update();
		chzn.disable();
		
		$().chzn(options); 等同于 $().chzn('init',options);
		$().chzn('destroy',options);
		$().chzn('update',options);
		$().chzn('disable',options);
		
		每个被初始化的元素都独立拥有一个对象
		
		
	*/
	/*
		
		
	*/
	
	//没有继承的概念
	$.UI.Extend('chzn',{
		//高封装性的写法
		options:{
			
		},
		//此处自动对传入options做extend处理
		init:function(){
			this.options;
			this.el.find('.childnode'); //自动赋给对应的el元素，
			//do something
			this.update();
		},
		
		destroy:function(opts){
			this.options;
		},
		
		update:function(opts){
			
		},
		disable:function(opts){
			
		},
		
	});
	
	
	//取消低封装性的写法
	
	$.UI.Extend('chzn',function(options){
		
		this.find('.childnode'); //自动赋给对应的el元素，
		//do something
		this.update();
		
	});
	
	
	
	$.Util.Extend({
		filterTags:function(){},
		getNow:function(){},
		dateDiff:function(a,b){},
		
	});
	
});



