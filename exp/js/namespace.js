define(['grace'],
function(G){
	/*
		Widget初始化后将生成一个完整对象
		包括状态变量、方法
		在同一命名空间内部
	*/
	G.Widget('exp/chat', {
		
		
		// exp命名空间下可通过 this.chat 来访问 exp/chat 命名空间下的元素
		// exp/chat 命名空间下可通过 this.root 访问根命名空间的对象，this.root.chat 访问其他对象
		
		// 先进行数据初始化 再进行init初始化
		// 数据初始化 从根开始
		// init初始化 由底层到根层
		
		
		
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
