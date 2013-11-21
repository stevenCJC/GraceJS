define(['grace'],
function(G){
	
	/*
		方法名会注册到 信息中心
		监听全局性信息事件触发
	*/
	
	
	G.Subscribe('exp', {
		
	},{
		// exp/show 会注册到 信息中心 当 show 信息发布，即可触发
		'somebody/say':function(data){
			this.show(data);
		},
		'exp/hide':function(data){
			this.hide(data);
		},
		'exp/render':function(){
			
		},
	});
})
