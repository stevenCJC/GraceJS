define(['pk'],function($){
	
	/*
		var page=$().page();//检测初始化状态，自动调用init， 返回 page 的 instance ;
		page.destroy();
		page.update();
		page.disable();
		
		$().page(options); 等同于 $().page('init',options);
		$().page('destroy',options);
		$().page('update',options);
		$().page('disable',options);
		
		每个被初始化的元素都独立拥有一个对象
		
		
	*/
	/*
		
		
	*/
	
	//没有继承的概念
	$.UI.extend('page',{
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
	
	
	
});



