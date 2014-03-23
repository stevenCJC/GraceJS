define(["./core",'oop/baseClass'], function(G,baseClass) {

	G.Extend('grace',{
		
		Rebuilt:function(path,options){
			baseClassInfo('REBUILT');
			return this;
		},
		
		Inherit:function(path,options){
			baseClassInfo('INHERIT');
			return this;
		}
	});
	function baseClassInfo(type){
		if(!options) options='*';
		else options=options.split(/\s|\,/g);
		baseClass.path=path;
		baseClass.options=options;
		baseClass.type=type;
	}
});
