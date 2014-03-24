define(['./core','_','function/fixPath','engine/$$','function/makeWidget','function/deepClone','oop/baseClass'], function(G,_,fixPath,$$,makeWidget,deepClone,baseClass) {

	G.Extend('widget/behavior,page/behavior',{

		subscribe:[function(path,subs,root){
			for(var x in subs) subscribe(this,x);
		},function(path,subs,proto){
			for(var x in subs) proto['zzS_'+x]=subs[x];
		}],

		
		
		
	})
	

	
	//初始化订阅功能
	function subscribe(that,path){
		var key='zzS_'+path;//对象中对应的执行方法的prototype键
		path=fixPath(path,that);
		if(that[key].constructor==String) key=that[key];
		G.MD.subscribe(path,function(message){
			that[key](message);
		});
	}
	


	return G;
});