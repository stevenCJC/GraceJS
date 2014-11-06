define(['pk'],function($){
	
	
	//没有继承的概念
	$.Widget.Create(function Main(){
		
		
	},{
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
	
	
	
});



