require(['grace'],function(G){
	
	G.View(function(V,$){
		V(function(){
			//var
			//init
			
		},{
			//样式
			Css:'~/packages/common/src/main.css',
			//模板
			Tpl:{
				navbar:'~/packages/common/src/navbar.html',
			},
			//初始化后有效，未初始化不起作用
			Extend:{
				'ui.chzn':'chzn',
				'$.fn.chosen':'',
				'$.chznVal':'',
			},
			//各种类型的事件绑定，外部可通过trigger触发事件，
			Event:{
				'click body@{id}':'alert',
				loadIndex:'loadIndex',
			},
			//控制器可绑定事件，但不能直接更改状态
			State:{
				open:1,
			},
			//销毁自身，回收内存
			Destroy:function(){
				
				
			},
		},{
			
		});
	});
	
	
});

