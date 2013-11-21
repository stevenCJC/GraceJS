define(['grace'],
function(G){
	
	G.Widget('exp/chat', {
		
		
		/*
		
			
			定义阶段：
					 1.  收集widget各级命名空间各部分元素
					 2.  对各命名空间的元素实现对象整合
					 3.  初始化数据
					 4.  初始化binder,listener
					 5.  执行init
		
		
		
		
		
		
		*/
		
		
		
		/*	
			变量配置
			全局初始化后会生成状态数据实例
			配置不可更改
			可定义绑定数据源以及数据关系
			可实现异步加载数据
		*/
		this:{
			inited:false,
		},
		show:{
			width:'#exp/win.width',
		},
	},{
		/*	Listener
			方法抽象
			在变量域内部可使用this指针调用对象
		*/
		show:function(p){
			this.inited||this.render();
			$(p).width(this.width).show();
		},
	},{
		/*
			方法抽象
			在变量域内部可使用this指针调用对象
		*/
		slideDown:function(p){
			this.inited||this.render();
			$(p).width(this.width).show();
		},
	},{
		/*
			事件绑定
			
			
		*/
		'mouseenter':'show'
	});
})
