define(['grace'],
function(G){
	G.Function('exp', {
		
		
	},{
		show:function(){
			//向信息中心发布广播信息
			this.publish('say/text',{title:'哈哈',content:'我是齐天大圣！'});
		},
		hide:function(){
			
		},
		render:function(){
			
		},
	});
})

