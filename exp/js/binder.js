define(['grace'],
function(G){
	G.Binder('exp', {
		
	},{
		
		//	[id^="exp/show"]
		'click body@#exp/show':function(){
			this.$el;
			this.e;
			this.data;
			this.publish;
		},
		
		//	#exp/show?header
		'click body@#exp/show?header':function(){
			this.data;//header
		},
		
		//	#exp/show?header
		'click body@#exp/show?header=2':'show',
		//this.data;//{header:2}
		
		
		//	#exp/show?header 默认委托到#exp
		'click #exp/show?header':'show',
		
		
	});
})
