G.Extend('widget/behavior/init,page/behavior/init',{
	
	dom:function(that,target,callback){
		var t=$$(target);
		var set=t.data('set');
		if(set.constructor==String) set=G.DS.getDS(set);
		callback.call(that,t,set);
	},
	
});